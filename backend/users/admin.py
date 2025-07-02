from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User # Replace with actual model

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    pass
