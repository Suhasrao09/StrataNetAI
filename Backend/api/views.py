from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, SensorReading, Alert
from .serializers import UserSerializer, SensorReadingSerializer, AlertSerializer
import csv
from io import TextIOWrapper
from decimal import Decimal
from datetime import datetime


# ==================== AUTH VIEWS ====================

@api_view(['POST', 'OPTIONS'])
@permission_classes([AllowAny])
def login_view(request):
    """User login"""
    if request.method == 'OPTIONS':
        return Response(status=status.HTTP_200_OK)
    
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role')
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    authenticated_user = authenticate(username=user.username, password=password)
    
    if not authenticated_user:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if authenticated_user.role != role:
        return Response({'error': f'You do not have {role} access'}, status=status.HTTP_403_FORBIDDEN)
    
    refresh = RefreshToken.for_user(authenticated_user)
    
    return Response({
        'user': {
            'id': authenticated_user.id,
            'username': authenticated_user.username,
            'email': authenticated_user.email,
            'first_name': authenticated_user.first_name,
            'last_name': authenticated_user.last_name,
            'role': authenticated_user.role,
        },
        'tokens': {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }
    })


@api_view(['POST', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """User logout"""
    if request.method == 'OPTIONS':
        return Response(status=status.HTTP_200_OK)
    return Response({'message': 'Logout successful'})


@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Get user profile"""
    if request.method == 'OPTIONS':
        return Response(status=status.HTTP_200_OK)
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# ==================== SENSOR VIEWSET ====================

class SensorReadingViewSet(viewsets.ModelViewSet):
    queryset = SensorReading.objects.all().order_by('-timestamp')
    serializer_class = SensorReadingSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def statistics(self, request):
        """Get sensor statistics"""
        stats = {
            'total_sensors': SensorReading.objects.values('sensor_id').distinct().count(),
            'total_readings': SensorReading.objects.count(),
            'rockfall_events': SensorReading.objects.filter(rockfall_occurred=True).count(),
            'high_risk_count': SensorReading.objects.filter(rockfall_risk_score__gte=75).count(),
        }
        return Response(stats)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def upload_csv(self, request):
        """Upload CSV file"""
        if 'file' not in request.FILES:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        csv_file = request.FILES['file']
        
        if not csv_file.name.endswith('.csv'):
            return Response({'error': 'File must be CSV'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            decoded_file = TextIOWrapper(csv_file.file, encoding='utf-8')
            csv_reader = csv.DictReader(decoded_file)
            
            created_count = 0
            error_count = 0
            error_messages = []
            
            for row_num, row in enumerate(csv_reader, start=2):
                try:
                    def safe_decimal(value):
                        if not value or value.strip() == '':
                            return Decimal('0')
                        return Decimal(value)
                    
                    def safe_int(value):
                        if not value or value.strip() == '':
                            return 0
                        return int(float(value))
                    
                    def safe_bool(value):
                        if isinstance(value, str):
                            return value.strip().lower() in ['true', '1', 'yes']
                        return bool(int(value))
                    
                    timestamp_str = row['timestamp'].strip()
                    timestamp = None
                    for fmt in ['%Y-%m-%d %H:%M:%S', '%Y-%m-%d', '%m/%d/%Y %H:%M:%S', '%m/%d/%Y']:
                        try:
                            timestamp = datetime.strptime(timestamp_str, fmt)
                            break
                        except ValueError:
                            continue
                    
                    if not timestamp:
                        raise ValueError(f"Cannot parse timestamp: {timestamp_str}")
                    
                    sensor_reading = SensorReading.objects.create(
                        timestamp=timestamp,
                        year=safe_int(row['year']),
                        month=safe_int(row['month']),
                        day_of_year=safe_int(row['day_of_year']),
                        hour=safe_int(row['hour']),
                        shift=row['shift'].strip(),
                        sensor_id=row['sensor_id'].strip(),
                        latitude=safe_decimal(row['latitude']),
                        longitude=safe_decimal(row['longitude']),
                        elevation_ft=safe_decimal(row['elevation_ft']),
                        weather_station_id=row['weather_station_id'].strip(),
                        sensor_status=row['sensor_status'].strip(),
                        data_quality_flag=row['data_quality_flag'].strip(),
                        temperature_f=safe_decimal(row['temperature_f']),
                        precipitation_in=safe_decimal(row['precipitation_in']),
                        humidity_pct=safe_decimal(row['humidity_pct']),
                        wind_speed_mph=safe_decimal(row['wind_speed_mph']),
                        barometric_pressure_inhg=safe_decimal(row['barometric_pressure_inhg']),
                        slope_zone=row['slope_zone'].strip(),
                        slope_angle_deg=safe_decimal(row['slope_angle_deg']),
                        bench_height_ft=safe_decimal(row['bench_height_ft']),
                        rock_type=row['rock_type'].strip().upper(),
                        rock_mass_rating=safe_int(row['rock_mass_rating']),
                        joint_spacing_ft=safe_decimal(row['joint_spacing_ft']),
                        joint_orientation_deg=safe_decimal(row['joint_orientation_deg']),
                        depth_to_water_ft=safe_decimal(row['depth_to_water_ft']),
                        pore_pressure_psi=safe_decimal(row['pore_pressure_psi']),
                        blast_frequency_7days=safe_int(row['blast_frequency_7days']),
                        distance_to_blast_ft=safe_decimal(row['distance_to_blast_ft']),
                        blast_magnitude_lbs=safe_decimal(row['blast_magnitude_lbs']),
                        equipment_passes_per_shift=safe_int(row['equipment_passes_per_shift']),
                        microseismic_events_daily=safe_int(row['microseismic_events_daily']),
                        max_seismic_magnitude=safe_decimal(row['max_seismic_magnitude']),
                        displacement_rate_mm_per_day=safe_decimal(row['displacement_rate_mm_per_day']),
                        cumulative_displacement_mm=safe_decimal(row['cumulative_displacement_mm']),
                        tiltmeter_microradians=safe_decimal(row['tiltmeter_microradians']),
                        strain_gauge_microstrain=safe_decimal(row['strain_gauge_microstrain']),
                        vibration_ppv_mm_per_s=safe_decimal(row['vibration_ppv_mm_per_s']),
                        rockfall_risk_score=safe_decimal(row['rockfall_risk_score']),
                        rockfall_occurred=safe_bool(row['rockfall_occurred']),
                        rockfall_size_category=row['rockfall_size_category'].strip(),
                    )
                    
                    risk_score = float(sensor_reading.rockfall_risk_score)
                    if risk_score >= 50:
                        alert_type = 'CRITICAL' if risk_score >= 75 else 'HIGH'
                        Alert.objects.create(
                            alert_id=f'ALERT-{sensor_reading.sensor_id}-{sensor_reading.id}',
                            sensor_reading=sensor_reading,
                            alert_type=alert_type,
                            status='ACTIVE',
                            zone_name=sensor_reading.slope_zone,
                            risk_score=sensor_reading.rockfall_risk_score,
                            recommended_action='Monitor closely and restrict access.'
                        )
                    
                    created_count += 1
                    
                except KeyError as e:
                    error_count += 1
                    error_msg = f"Row {row_num}: Missing column {str(e)}"
                    error_messages.append(error_msg)
                    print(error_msg)
                    
                except Exception as e:
                    error_count += 1
                    error_msg = f"Row {row_num}: {type(e).__name__} - {str(e)}"
                    error_messages.append(error_msg)
                    print(error_msg)
            
            response_data = {
                'message': 'CSV processed',
                'created': created_count,
                'errors': error_count,
                'total_processed': created_count + error_count
            }
            
            if error_messages:
                response_data['error_samples'] = error_messages[:10]
            
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': f'Failed to process CSV: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['delete'], permission_classes=[IsAuthenticated])
    def clear_all(self, request):
        """Clear all data - Admin only"""
        if request.user.role != 'ADMIN':
            return Response({'error': 'Only admins can clear data'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            sensor_count = SensorReading.objects.count()
            alert_count = Alert.objects.count()
            Alert.objects.all().delete()
            SensorReading.objects.all().delete()
            return Response({
                'message': 'All data cleared',
                'sensors_deleted': sensor_count,
                'alerts_deleted': alert_count,
            })
        except Exception as e:
            return Response({'error': f'Failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== ALERT VIEWSET ====================

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all().order_by('-created_at')
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Get dashboard stats"""
        stats = {
            'total_alerts': Alert.objects.count(),
            'active_alerts': Alert.objects.filter(status='ACTIVE').count(),
            'critical_alerts': Alert.objects.filter(alert_type='CRITICAL', status='ACTIVE').count(),
            'high_alerts': Alert.objects.filter(alert_type='HIGH', status='ACTIVE').count(),
        }
        return Response(stats)
