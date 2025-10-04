from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

# User Model
class User(AbstractUser):
    ROLE_CHOICES = [
        ('MANAGER', 'Manager'),
        ('ADMIN', 'Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='MANAGER')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    def __str__(self):
        return f"{self.username} ({self.role})"

# Sensor Reading Model
class SensorReading(models.Model):
    # Temporal fields
    timestamp = models.DateTimeField(db_index=True)
    year = models.PositiveIntegerField()
    month = models.PositiveSmallIntegerField()
    day_of_year = models.PositiveSmallIntegerField()
    hour = models.PositiveSmallIntegerField()
    shift = models.CharField(max_length=20)
    
    # Sensor info
    sensor_id = models.CharField(max_length=50, db_index=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=7)
    longitude = models.DecimalField(max_digits=10, decimal_places=7)
    elevation_ft = models.DecimalField(max_digits=8, decimal_places=2)
    
    # Metadata
    weather_station_id = models.CharField(max_length=50)
    sensor_status = models.CharField(max_length=20, default='ACTIVE')
    data_quality_flag = models.CharField(max_length=20, default='GOOD')
    
    # Weather
    temperature_f = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    precipitation_in = models.DecimalField(max_digits=6, decimal_places=3, null=True, blank=True)
    humidity_pct = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    wind_speed_mph = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    barometric_pressure_inhg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # Slope
    slope_zone = models.CharField(max_length=100, db_index=True)
    slope_angle_deg = models.DecimalField(max_digits=5, decimal_places=2)
    bench_height_ft = models.DecimalField(max_digits=6, decimal_places=2)
    
    # Rock
    rock_type = models.CharField(max_length=50)
    rock_mass_rating = models.PositiveSmallIntegerField()
    joint_spacing_ft = models.DecimalField(max_digits=6, decimal_places=2)
    joint_orientation_deg = models.DecimalField(max_digits=5, decimal_places=2)
    
    # Hydrogeology
    depth_to_water_ft = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    pore_pressure_psi = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    
    # Blast
    blast_frequency_7days = models.PositiveSmallIntegerField(default=0)
    distance_to_blast_ft = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    blast_magnitude_lbs = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Equipment
    equipment_passes_per_shift = models.PositiveIntegerField(default=0)
    
    # Seismic
    microseismic_events_daily = models.PositiveIntegerField(default=0)
    max_seismic_magnitude = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    
    # Deformation
    displacement_rate_mm_per_day = models.DecimalField(max_digits=10, decimal_places=4)
    cumulative_displacement_mm = models.DecimalField(max_digits=12, decimal_places=4)
    tiltmeter_microradians = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    strain_gauge_microstrain = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    vibration_ppv_mm_per_s = models.DecimalField(max_digits=8, decimal_places=4, null=True, blank=True)
    
    # Risk
    rockfall_risk_score = models.DecimalField(max_digits=5, decimal_places=2)
    rockfall_occurred = models.BooleanField(default=False, db_index=True)
    rockfall_size_category = models.CharField(max_length=20, default='NONE')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        
    def __str__(self):
        return f"{self.sensor_id} - {self.timestamp}"

# Alert Model
class Alert(models.Model):
    ALERT_TYPES = [
        ('CRITICAL', 'Critical'),
        ('HIGH', 'High'),
        ('MEDIUM', 'Medium'),
        ('LOW', 'Low'),
    ]
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('RESOLVED', 'Resolved'),
    ]
    
    alert_id = models.CharField(max_length=50, unique=True)
    sensor_reading = models.ForeignKey(SensorReading, on_delete=models.CASCADE, related_name='alerts')
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    zone_name = models.CharField(max_length=200)
    risk_score = models.DecimalField(max_digits=5, decimal_places=2)
    recommended_action = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.alert_id} - {self.alert_type}"
