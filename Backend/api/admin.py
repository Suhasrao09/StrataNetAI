from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, SensorReading, Alert

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'role', 'is_active']
    list_filter = ['role', 'is_active']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'phone_number')}),
    )

@admin.register(SensorReading)
class SensorReadingAdmin(admin.ModelAdmin):
    list_display = ['sensor_id', 'timestamp', 'slope_zone', 'rockfall_risk_score', 'rockfall_occurred']
    list_filter = ['sensor_status', 'rockfall_occurred', 'slope_zone']
    search_fields = ['sensor_id', 'slope_zone']

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ['alert_id', 'zone_name', 'alert_type', 'status', 'risk_score', 'created_at']
    list_filter = ['alert_type', 'status']
    search_fields = ['alert_id', 'zone_name']
