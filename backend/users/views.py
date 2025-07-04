from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model

from .models import Property, Booking, Notification, Payment  # ✅ Add Payment
from .serializers import PropertySerializer, BookingSerializer, NotificationSerializer, PaymentSerializer  # ✅ Add PaymentSerializer

User = get_user_model()

# ✅ Custom permission: Only owners can edit/delete, others can only view
class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.owner == request.user


# ✅ ViewSet: Properties
class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# ✅ ViewSet: Bookings
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(buyer=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        property_obj = serializer.validated_data['property']
        booking_type = serializer.validated_data['booking_type']

        # Update property status
        if booking_type == 'rent':
            property_obj.is_rented = True
        elif booking_type == 'buy':
            property_obj.is_sold = True
        property_obj.save()

        # Save booking
        booking = serializer.save(
            buyer=request.user,
            owner=property_obj.owner,
            status='paid'
        )

        # Create notifications
        Notification.objects.bulk_create([
            Notification(
                user=property_obj.owner,
                message=f"Your property '{property_obj.name}' has been booked by {booking.buyer.email}."
            ),
            Notification(
                user=booking.buyer,
                message=f"You have successfully booked '{property_obj.name}'."
            )
        ])

        # Notify internal admins
        admin_emails = ['sara@moovin.com', 'joseph@moovin.com']
        for email in admin_emails:
            try:
                admin_user = User.objects.get(email=email)
                Notification.objects.create(
                    user=admin_user,
                    message=f"New booking: '{property_obj.name}' was booked by {booking.buyer.email}."
                )
            except User.DoesNotExist:
                pass

        # Email notifications
        send_mail(
            subject='Property Booked Notification',
            message=f"Your property '{property_obj.name}' has been booked by {booking.buyer.email}.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[property_obj.owner.email],
            fail_silently=False,
        )

        send_mail(
            subject='Booking Confirmation',
            message=f"You have successfully booked '{property_obj.name}' from {property_obj.owner.email}.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[booking.buyer.email],
            fail_silently=False,
        )

        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)


# ✅ ViewSet: Notifications
class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')


# ✅ NEW ViewSet: Payments
class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
