from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from .views_ml import PredictRockfallRisk

router = DefaultRouter()
router.register(r'sensors', views.SensorReadingViewSet, basename='sensor')
router.register(r'alerts', views.AlertViewSet, basename='alert')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/profile/', views.profile_view, name='profile'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('predict-risk/', PredictRockfallRisk.as_view(), name='predict-risk'),
]
