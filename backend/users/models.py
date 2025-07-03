from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
from django.conf import settings

# -------------------------
# Custom User Model
# -------------------------
class User(AbstractUser):
    USER_ROLES = (
        ('admin', 'Admin'),
        ('tenant', 'Tenant'),
        ('landlord', 'Landlord'),
    )

    username = models.CharField(max_length=150, blank=True, null=True)  # Allow null in DB too
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=USER_ROLES)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # No username needed in create_superuser

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
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# -------------------------
# Property Image Model (Multiple images per property)
# -------------------------
class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='property_images/')

    def __str__(self):
        return f"Image for {self.property.name}"
