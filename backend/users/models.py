from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
from django.conf import settings
from django.utils import timezone

# -------------------------
# Custom User Model
# -------------------------
class User(AbstractUser):
    USER_ROLES = (
        ('admin', 'Admin'),
        ('tenant', 'Tenant'),
        ('landlord', 'Landlord'),
    )

    username = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=USER_ROLES)
        # ✅ New Fields
    full_name = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.email} ({self.role})"


# -------------------------
# Property Model
# -------------------------
class Property(models.Model):
    STATUS_CHOICES = [
        ('rent', 'For Rent'),
        ('sale', 'For Sale')
    ]

    CATEGORY_CHOICES = [
        ('Apartment', 'Apartment'),
        ('Bedsitter', 'Bedsitter'),
        ('Single Room', 'Single Room'),
        ('Hostel', 'Hostel'),
        ('Bungalow', 'Bungalow'),
        ('Maisonette', 'Maisonette'),
        ('Studio', 'Studio'),
        ('Office', 'Office'),
        ('Villa', 'Villa'),
        ('Shop', 'Shop'),
        ('House', 'House'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='properties')
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    rent = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    size = models.PositiveIntegerField(help_text='Size in square meters or sqft')
    beds = models.PositiveIntegerField(default=0)
    baths = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='rent')
    featured = models.BooleanField(default=False)
    is_booked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# -------------------------
# Property Image Model
# -------------------------
class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='property_images/')

    def __str__(self):
        return f"Image for {self.property.name}"


# -------------------------
# Booking Model
# -------------------------
class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid')
    ]

    BOOKING_TYPE_CHOICES = [
        ('rent', 'Rent'),
        ('buy', 'Buy')
    ]

    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='bookings')
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_bookings')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    booking_type = models.CharField(max_length=10, choices=BOOKING_TYPE_CHOICES, default='rent')
    payment_method = models.CharField(max_length=50, default='Card')
    created_at = models.DateTimeField(auto_now_add=True)
    is_sold = models.BooleanField(default=False)
    is_rented = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.booking_type.title()} by {self.buyer.email} for {self.property.name}"


# -------------------------
# Notification Model
# -------------------------
class Notification(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    message = models.TextField()
    link = models.URLField(blank=True, null=True)
    notification_type = models.CharField(
        max_length=50,
        choices=[
            ('booking', 'Booking'),
            ('payment', 'Payment'),
            ('alert', 'Alert'),
            ('info', 'Information'),
            ('system', 'System'),
        ],
        default='info'
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"To {self.user.email}: {self.message[:50]}"


# -------------------------
# ✅ Payment Model (Now Fixed and Ready)
# -------------------------

class Payment(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    property = models.ForeignKey('Property', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    

    date = models.DateField(default=timezone.now)  # ✅ fixed
    time = models.TimeField(default=timezone.now)  # ✅ fixed  

    months = models.JSONField()  # expects list like ["July", "August"]
    cardNumber = models.CharField(max_length=20)
    cvv = models.CharField(max_length=5)
    expiry = models.CharField(max_length=7)

    def __str__(self):
        return f"Payment of ${self.amount} by {self.user.email}"


# -------------------------
# ✅ Professionals model
# -------------------------
class Professional(models.Model):
    full_name = models.CharField(max_length=100)
    profession = models.CharField(max_length=100)
    description = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.profession}"