from djoser.serializers import UserCreateSerializer, UserSerializer, TokenCreateSerializer
from rest_framework import serializers
from .models import User, Property, PropertyImage, Booking

# -------------------------
# User Serializers
# -------------------------

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'password', 'role')

class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'role')

class CustomTokenCreateSerializer(TokenCreateSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['role'] = user.role
        return data

# -------------------------
# Property Serializers
# -------------------------

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image']

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = ['owner']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        property_instance = Property.objects.create(**validated_data)
        for image in uploaded_images:
            PropertyImage.objects.create(property=property_instance, image=image)
        return property_instance


# -------------------------
# Booking Serializer
# -------------------------

class BookingSerializer(serializers.ModelSerializer):
    property_name = serializers.CharField(source='property.name', read_only=True)
    landlord_email = serializers.EmailField(source='owner.email', read_only=True)
    tenant_email = serializers.EmailField(source='buyer.email', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'property', 'property_name', 'buyer', 'tenant_email',
            'owner', 'landlord_email', 'status', 'created_at'
        ]
        read_only_fields = ['buyer', 'owner', 'created_at', 'tenant_email', 'landlord_email']
