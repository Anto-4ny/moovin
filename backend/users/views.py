from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions, status, generics
from rest_framework.permissions import BasePermission, SAFE_METHODS, IsAuthenticated
from rest_framework.response import Response

from .models import Property, Booking, Notification, Payment, Professional
from .serializers import (
    PropertySerializer,
    BookingSerializer,
    NotificationSerializer,
    PaymentSerializer,
    CustomUserSerializer,
    ProfessionalSerializer
)

User = get_user_model()

# ✅ Permission: Only the owner can edit/delete
class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.owner == request.user


# ✅ ViewSet: Users - Only admin can see all users
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by('-id')
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return User.objects.all().order_by('-id') if user.role == 'admin' else User.objects.none()


# ✅ ViewSet: Properties
class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# ✅ ViewSet: Bookings
class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'landlord':
            return Booking.objects.filter(owner=user).select_related('buyer', 'property', 'owner').order_by('-created_at')
        return Booking.objects.filter(buyer=user).select_related('buyer', 'property', 'owner').order_by('-created_at')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        property_obj = serializer.validated_data.get('property')
        booking_type = serializer.validated_data.get('booking_type')

        if not property_obj:
            return Response({'detail': 'Property ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Update property status
        if booking_type == 'rent':
            property_obj.is_rented = True
        elif booking_type == 'buy':
            property_obj.is_sold = True
        property_obj.save()

        booking = serializer.save(
            buyer=request.user,
            owner=property_obj.owner,
            status='paid'
        )

        # Create Notifications
        Notification.objects.bulk_create([
            Notification(user=property_obj.owner,
                         message=f"Your property '{property_obj.name}' has been booked by {booking.buyer.email}."),
            Notification(user=booking.buyer,
                         message=f"You have successfully booked '{property_obj.name}'.")
        ])

        # Notify internal admins
        for email in ['toni4pius@gmail.com', 'joseph@moovin.com']:
            try:
                admin_user = User.objects.get(email=email)
                Notification.objects.create(
                    user=admin_user,
                    message=f"New booking: '{property_obj.name}' was booked by {booking.buyer.email}."
                )
            except User.DoesNotExist:
                continue

        # Send confirmation emails
        send_mail(
            subject='Property Booked Notification',
            message=f"Your property '{property_obj.name}' has been booked by {booking.buyer.email}.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[property_obj.owner.email],
            fail_silently=True,
        )
        send_mail(
            subject='Booking Confirmation',
            message=f"You have successfully booked '{property_obj.name}' from {property_obj.owner.email}.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[booking.buyer.email],
            fail_silently=True,
        )

        return Response(
            BookingSerializer(booking, context=self.get_serializer_context()).data,
            status=status.HTTP_201_CREATED
        )


# ✅ ViewSet: Notifications
class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')


# ✅ ViewSet: Payments
class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'landlord':
            return Payment.objects.filter(property__owner=user).select_related('user', 'property').order_by('-date')
        return Payment.objects.filter(user=user).select_related('user', 'property').order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ✅ ViewSet: Professionals
class ProfessionalListCreateView(generics.ListCreateAPIView):
    queryset = Professional.objects.all().order_by('-created_at')
    serializer_class = ProfessionalSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
