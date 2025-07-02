from django.contrib.auth.models import AbstractUser
from django.db import models

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
    REQUIRED_FIELDS = []  # You don’t need to require username since it's not unique or primary

    def __str__(self):
        return f"{self.email} ({self.role})"