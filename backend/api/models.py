from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class URL(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="user_url")
    
    long_url = models.URLField(max_length=1000)
    short_code = models.CharField(max_length=20, unique=True, db_index=True)
    
    is_active = models.BooleanField(default=True)
    clicks = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']  
    
    
    def __str__(self):
        return f'${self.user.username} has created ${self.long_url}' 