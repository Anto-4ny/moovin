from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PropertyViewSet, BookingViewSet, NotificationViewSet,
    PaymentViewSet, UserViewSet, ProfessionalListCreateView
)

router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='properties')
router.register(r'bookings', BookingViewSet, basename='bookings')  
router.register(r'notifications', NotificationViewSet, basename='notifications')
router.register(r'payments', PaymentViewSet, basename='payments')
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    path('', include('djoser.urls')),
    path('', include('djoser.urls.authtoken')),
    path('', include(router.urls)),
    path('professionals/', ProfessionalListCreateView.as_view(), name='professional-list-create'),
]






