from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS

from .models import Property
from .serializers import PropertySerializer


# ✅ Custom permission to allow only owners to edit/delete
class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow GET, HEAD, OPTIONS for any user
        if request.method in SAFE_METHODS:
            return True
        # Only allow write permissions to the owner of the property
        return obj.owner == request.user


# ✅ ViewSet for Property
class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertySerializer

    # Only owners can edit/delete their properties
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    # Automatically assign the logged-in user as the owner
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
