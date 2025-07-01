from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),              # Your custom routes
    path('api/auth/', include('djoser.urls')),             # Djoser base routes
    path('api/auth/', include('djoser.urls.authtoken')),   # 👉 This enables /token/login/
]


