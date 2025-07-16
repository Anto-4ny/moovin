from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from django.http import HttpResponse

def home(request):
    return HttpResponse("🎉 Django is Live on Render!")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),  # This now includes all: djoser + properties
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/', include('allauth.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

