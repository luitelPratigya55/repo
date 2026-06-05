from rest_framework import serializers
from django.contrib.auth.models import User
from .models import URL

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = ["id", "username", "password"]
        extra_kwargs = {
            "password":{
                "write_only":True
            }
        }
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
class CreateURLSerializer(serializers.ModelSerializer):
    
    short_url = serializers.SerializerMethodField()
    
    class Meta:
        model=URL
        fields = ["id","user","long_url","short_code","short_url","created_at", "clicks", "is_active"]
        extra_kwargs = {
            "short_code":{
                "read_only": True
            },
            
            "short_url":{
                "read_only": True
            },
            
            "created_at":{
                "read_only": True
            },
            
            "clicks":{
                "read_only": True
            }
            
        }
        
        def get_short_url(self,obj):
            pass
        
        def generate_short_code(self, long_url):
            
            pass
        
        def validate_url(self,value):
            pass
        
        
        def create(self,validated_data):
            pass