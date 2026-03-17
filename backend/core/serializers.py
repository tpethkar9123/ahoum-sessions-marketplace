from rest_framework import serializers
from .models import User, Session, Booking

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'avatar_url']
        read_only_fields = ['id', 'username', 'email', 'role']

class SessionSerializer(serializers.ModelSerializer):
    creator_name = serializers.CharField(source='creator.get_full_name', read_only=True)
    
    class Meta:
        model = Session
        fields = ['id', 'title', 'description', 'date', 'time', 'price', 'creator', 'creator_name', 'created_at']
        read_only_fields = ['creator', 'created_at']

class BookingSerializer(serializers.ModelSerializer):
    session_details = SessionSerializer(source='session', read_only=True)
    
    class Meta:
        model = Booking
        fields = ['id', 'user', 'session', 'session_details', 'status', 'booked_at']
        read_only_fields = ['user', 'booked_at']
