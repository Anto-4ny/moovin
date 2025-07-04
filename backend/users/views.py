from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.response import Response
from rest_framework import status

from .models import Property, Booking  # ✅ Add Booking
from .serializers import PropertySerializer, BookingSerializer
from . import serializers # ✅ Add BookingSerializer

# ✅ Custom permission to allow only owners to edit/delete
class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.owner == request.user

# ✅ ViewSet for Property
class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# ✅ ViewSet for Bookings
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        property_obj = serializer.validated_data['property']

        if property_obj.is_booked:
            raise serializers.ValidationError("This property is already booked.")

        # Mark property as booked
        property_obj.is_booked = True
        property_obj.save()

        serializer.save(
            buyer=self.request.user,
            owner=property_obj.owner,
            status='paid'  # Simulating payment success
        )

        # TODO: Send email to landlord and tenant with contact details
        # You can use Django's send_mail() function or Django Rest Email service
