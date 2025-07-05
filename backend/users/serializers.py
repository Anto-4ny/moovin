from djoser.serializers import UserCreateSerializer, UserSerializer, TokenCreateSerializer
from rest_framework import serializers
from .models import User, Property, PropertyImage, Booking, Notification, Payment


# -------------------------
# ✅ User Serializers
# -------------------------

class CustomUserCreateSerializer(UserCreateSerializer):
    phone_number = serializers.CharField(required=False)
    full_name = serializers.CharField(required=False)

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'password', 'role', 'phone_number', 'full_name')


class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'role', 'phone_number', 'full_name')


class CustomTokenCreateSerializer(TokenCreateSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['role'] = user.role
        return data


# -------------------------
# ✅ Property Serializers
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

    # Owner info
    owner_name = serializers.CharField(source='owner.username', read_only=True)
    owner_phone = serializers.CharField(source='owner.phone_number', read_only=True)

    class Meta:
        model = Property
        fields = [
            'id', 'name', 'location', 'rent', 'category', 'description', 'size',
            'beds', 'baths', 'status', 'featured', 'owner', 'images', 'uploaded_images',
            'owner_name', 'owner_phone'
        ]
        read_only_fields = ['owner', 'owner_name', 'owner_phone']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        property_instance = Property.objects.create(**validated_data)
        for image in uploaded_images:
            PropertyImage.objects.create(property=property_instance, image=image)
        return property_instance


# -------------------------
# ✅ Booking Serializer
# -------------------------

class BookingSerializer(serializers.ModelSerializer):
    property = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all())

    payment_history = serializers.SerializerMethodField()
    due_months = serializers.SerializerMethodField()

    property_details = PropertySerializer(source='property', read_only=True)
    buyer_details = CustomUserSerializer(source='buyer', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'property', 'property_details', 'buyer', 'owner', 'status',
            'booking_type', 'payment_method', 'is_rented', 'is_sold', 'created_at',
            'payment_history', 'due_months', 'buyer_details'
        ]
        read_only_fields = ['buyer', 'owner', 'created_at', 'is_rented', 'is_sold']

    def get_payment_history(self, obj):
        payments = Payment.objects.filter(property=obj.property, user=obj.buyer).order_by('-date')
        return PaymentSerializer(payments, many=True).data

    def get_due_months(self, obj):
        all_months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
        payments = Payment.objects.filter(property=obj.property, user=obj.buyer)
        paid_months = set()

        for payment in payments:
            if isinstance(payment.months, list):
                paid_months.update(payment.months)

        return [m for m in all_months if m not in paid_months]


# -------------------------
# ✅ Notification Serializer
# -------------------------

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['created_at']


# -------------------------
# ✅ Payment Serializer
# -------------------------

class PaymentSerializer(serializers.ModelSerializer):
    property = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all())
    property_name = serializers.CharField(source='property.name', read_only=True)
    user_details = CustomUserSerializer(source='user', read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['user']
