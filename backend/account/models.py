from django.db import models
from common.models import BaseModel
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from phonenumber_field.modelfields import PhoneNumberField
from django.utils.crypto import get_random_string
import uuid


# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, password, username, phoneNumber, role, is_admin, **extra_fields):
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        extra_fields.setdefault("user_id", uuid.uuid4())
        user = self.model(email=email, username=username, phoneNumber=phoneNumber, role=role, is_admin=is_admin, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, username, phoneNumber, role, **extra_fields):
        return self.create_user(email, password, username, phoneNumber, role, **extra_fields)


class User(AbstractBaseUser):
    MEMBER = "member"
    GUEST_USER = "guestUser"
    ADMIN = "admin"
    ROLE_CHOICES = [
        (MEMBER, "Member"),
        (GUEST_USER, "Guest User"),
        (ADMIN, "Admin"),
    ]
    REGULAR = "regular"
    PREMIUM = "premium"
    MEMBERSHIP_CHOICES = [(REGULAR, "Regular"), (PREMIUM, "Premium")]
    id = models.AutoField(primary_key=True)
    user_id = models.UUIDField(blank=True, null=True)
    username = models.CharField(max_length=24, blank=True, null=True)
    email = models.EmailField(max_length=254, unique=True)
    role = models.CharField(choices=ROLE_CHOICES, max_length=24)
    phoneNumber = PhoneNumberField()
    rewardPoints = models.FloatField(default=0)
    membership_type = models.CharField(choices=MEMBERSHIP_CHOICES, blank=True, null=True)
    password = models.CharField(max_length=128, blank=True, null=True)
    is_admin = models.BooleanField(default=False)
    
    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"<User {self.user_id} | {self.username} | {self.email} | {self.role}>"


class Token(BaseModel):
    key = models.CharField(max_length=64, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = get_random_string(length=64)
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.key
