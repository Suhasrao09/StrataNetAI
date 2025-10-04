from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from api.views_ml import PredictRockfallRisk

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
     path('api/predict-risk/', PredictRockfallRisk.as_view(), name='predict-risk'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
