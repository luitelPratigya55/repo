from rest_framework import serializers
from django.contrib.auth.models import User
from .models import URL
import hashlib
import base64 
import random, string
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
        fields = ["id","long_url","short_code","short_url","created_at", "clicks", "is_active"]
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
    
    def validate(self, data):
        request = self.context.get('request')
        long_url = data.get('long_url')
        
        
        existing_url = URL.objects.filter(
            user=request.user,
            long_url=long_url,
            is_active=True
        ).first()
        
        if existing_url:
            
            self.context['existing_url'] = existing_url
        
            raise serializers.ValidationError({
                'long_url': 'This URL has already been shortened'
            })
        
        return data
        
    def get_short_url(self,obj):
        request = self.context.get('request')
            
        print(request)
            
        if request:
            return f"{request.scheme}://{request.get_host()}/{obj.short_code}"
        
        return f"/{obj.short_code}"
            
    def generate_short_code(self, long_url):
        print(long_url)
        md5=hashlib.md5(long_url.encode()).digest()
        print(md5)
            
        short_code = base64.urlsafe_b64encode(md5)[:6].decode()
        print(short_code)
            
        while URL.objects.filter(short_code=short_code).exists():
            suffix = ''.join(random.choices(string.digits + string.ascii_letters, k=2))
            short_code = short_code[:4] + suffix
            
            print(short_code)
        
        return short_code
        
    def validate_long_url(self,value):
        if not value.startswith(("http://","https://")):
            value = "http://" + value
        return value
    
        
    def create(self,validated_data):
        validated_data["short_code"]=self.generate_short_code(validated_data["long_url"])
        validated_data["user"]=self.context["request"].user
        return super().create(validated_data)     