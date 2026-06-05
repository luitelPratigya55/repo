from django.shortcuts import render
from rest_framework import generics
from .serializers import RegistrationSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User

# Create your views here.

class RegistrationView(generics.CreateAPIView):
    queryset=User.objects.all()
    serializer_class=RegistrationSerializer
    permission_classes=[AllowAny]
