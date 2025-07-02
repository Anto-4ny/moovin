from djoser.serializers import UserCreateSerializer, UserSerializer, TokenCreateSerializer
from .models import User

# User Registration Serializer
class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'password', 'role')


# User Profile Serializer (used in /auth/users/me/)
class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'role')


# Custom Token Response Serializer for Login
class CustomTokenCreateSerializer(TokenCreateSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user  # ✅ this is the full User object

        # Add user's role to the response
        data['role'] = user.role
        return data
