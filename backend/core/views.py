import uuid
import requests
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Session, Booking
from .serializers import UserSerializer, SessionSerializer, BookingSerializer

User = get_user_model()

class IsCreator(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'CREATOR'

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all().order_by('-created_at')
    serializer_class = SessionSerializer
    permission_classes = [IsCreator]
        
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'CREATOR':
            return Booking.objects.filter(session__creator=user).order_by('-booked_at')
        return Booking.objects.filter(user=user).order_by('-booked_at')
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
        
    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OAuthLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        provider = request.data.get('provider')
        token = request.data.get('token')
        role = request.data.get('role', 'USER')
        
        email = None
        name = None
        oauth_id = None
        avatar_url = None
        
        if provider == 'dev': # Allow dev testing
            email = request.data.get('email', 'dev@example.com')
            name = request.data.get('name', 'Dev User')
            oauth_id = f"dev_{uuid.uuid4().hex[:8]}"
            avatar_url = ""
        elif provider == 'google':
            # In a real app, use: google.oauth2.id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
            # We will mock successful validation for the assignment's flow if a token is present
            if not token:
                return Response({'error': 'Token required'}, status=400)
            email = request.data.get('email', f"google_{uuid.uuid4().hex[:5]}@example.com")
            name = "Google User"
            oauth_id = f"google_{token[:10]}"
            avatar_url = ""
        else:
            return Response({'error': 'Unsupported provider'}, status=400)
            
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': f"{email.split('@')[0]}_{uuid.uuid4().hex[:8]}",
                'first_name': name.split(' ')[0] if name else '',
                'last_name': ' '.join(name.split(' ')[1:]) if name and ' ' in name else '',
                'oauth_provider': provider,
                'oauth_id': oauth_id,
                'avatar_url': avatar_url,
                'role': role
            }
        )
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
