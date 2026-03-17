from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SessionViewSet, BookingViewSet, UserProfileView, OAuthLoginView

router = DefaultRouter()
router.register(r'sessions', SessionViewSet)
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('auth/oauth/', OAuthLoginView.as_view(), name='oauth_login'),
]
