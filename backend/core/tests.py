import pytest
from django.contrib.auth import get_user_model
from core.models import Session, Booking

User = get_user_model()

@pytest.mark.django_db
class TestCoreModels:
    def test_create_user(self):
        user = User.objects.create(username="testuser", email="test@test.com", role="USER")
        assert user.username == "testuser"
        assert user.role == "USER"
        
    def test_create_session(self):
        creator = User.objects.create(username="creator", email="creator@test.com", role="CREATOR")
        session = Session.objects.create(
            title="Yoga Class", 
            description="Morning Yoga", 
            date="2026-04-01", 
            time="09:00", 
            price=20.00, 
            creator=creator
        )
        assert session.title == "Yoga Class"
        assert session.creator == creator

    def test_create_booking(self):
        user = User.objects.create(username="student", email="student@test.com", role="USER")
        creator = User.objects.create(username="teacher", email="teacher@test.com", role="CREATOR")
        session = Session.objects.create(
            title="Meditation", 
            description="Evening", 
            date="2026-04-01", 
            time="18:00", 
            price=15.00, 
            creator=creator
        )
        booking = Booking.objects.create(user=user, session=session)
        assert booking.status == "CONFIRMED"
        assert booking.user == user
        assert booking.session == session
