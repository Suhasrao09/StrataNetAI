from rest_framework import serializers
from .models import User, SensorReading, Alert


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_staff']
        read_only_fields = ['id']


class SensorReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorReading
        fields = '__all__'


class AlertSerializer(serializers.ModelSerializer):
    sensor_reading = SensorReadingSerializer(read_only=True)  # Include full sensor data
    
    class Meta:
        model = Alert
        fields = '__all__'
