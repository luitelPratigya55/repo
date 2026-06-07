from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from rest_framework import generics
from .serializers import RegistrationSerializer,CreateURLSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from .models import URL
from rest_framework import status
from rest_framework.response import Response
# Create your views here.

class RegistrationView(generics.CreateAPIView):
    queryset=User.objects.all()
    serializer_class=RegistrationSerializer
    permission_classes=[AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'success': True,
                'message': 'User registered successfully',
                'user_id': user.id,
                'username': user.username
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ListShortUrlsView(generics.ListAPIView):
    serializer_class = CreateURLSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return URL.objects.filter(user=self.request.user, is_active=True)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'total_urls': queryset.count(),
            'total_clicks': sum(url.clicks for url in queryset),
            'urls': serializer.data
        })

        
class CreateShortUrlView(generics.ListCreateAPIView):
    serializer_class=CreateURLSerializer
    permission_classes=[IsAuthenticated]
    
    def get_queryset(self):
        return URL.objects.filter(user=self.request.user, is_active=True)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'total_urls': queryset.count(),
            'total_clicks': sum(url.clicks for url in queryset),
            'urls': serializer.data
        })
    
    def perform_create(self,serializer):
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        long_url = request.data.get('long_url')
        existing_url = URL.objects.filter(
            user=request.user,
            long_url=long_url,
            is_active=True
        ).first()
        
        if existing_url:
            serializer = self.get_serializer(existing_url)
            return Response({
                'success': True,
                'message': 'URL already exists',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        
        return super().create(request, *args, **kwargs)

class RetrieveDestroyUpdateView(generics.RetrieveUpdateDestroyAPIView):
    
    permission_classes = [IsAuthenticated]
    lookup_field = 'short_code'
    serializer_class = CreateURLSerializer
    
    def get_queryset(self):
        return URL.objects.filter(user=self.request.user, is_active=True)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def perform_update(self, serializer):
        
        new_long_url = self.request.data.get('long_url')
        
        if new_long_url:
            
            if not new_long_url.startswith(('http://', 'https://')):
                new_long_url = 'https://' + new_long_url
            
            serializer.save(long_url=new_long_url)
        else:
            serializer.save()
    
    def perform_destroy(self, instance):
        
        instance.is_active = False
        instance.save()
    
    def destroy(self, request, *args, **kwargs):
    
        instance = self.get_object()
        short_code = instance.short_code
        
        self.perform_destroy(instance)
        
        return Response({
            'success': True,
            'message': f'URL with short code "{short_code}" deleted successfully',
            'deleted_short_code': short_code
        }, status=status.HTTP_200_OK)
    
    def update(self, request, *args, **kwargs):
        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        new_long_url = request.data.get('long_url')
        if not new_long_url:
            return Response({
                'success': False,
                'error': 'long_url is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'success': True,
            'message': 'URL updated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
        
class PublicRedirectView(generics.GenericAPIView):
    
    permission_classes = [AllowAny]
    
    def get(self, request, short_code):
        url = get_object_or_404(URL, short_code=short_code, is_active=True)
        
        url.clicks += 1
        url.save(update_fields=['clicks'])
        
        return redirect(url.long_url)