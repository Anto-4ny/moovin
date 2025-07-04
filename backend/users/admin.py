from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User # Replace with actual model
from .models import Notification
from .models import Payment

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    pass
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('user__email', 'message')


admin.site.register(Payment)
