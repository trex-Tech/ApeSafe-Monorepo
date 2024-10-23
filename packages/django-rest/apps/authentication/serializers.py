from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['wallet_id', 'id']
        read_only_fields = ['id']

    def create(self, validated_data):
        return User.objects.create(**validated_data)  

    
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()

  
    
    def validate(self, data):
        username = data.get('username')
        
        # Check if the user exists
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError({"username": "User with this username does not exist."})
        
        # Add the user to validated data
        data['user'] = user
        return data

    def create(self, validated_data):
        return validated_data  