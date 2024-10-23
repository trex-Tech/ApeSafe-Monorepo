from rest_framework import serializers
from .models import Token
from drf_extra_fields.fields import Base64ImageField

class TokenSerializer(serializers.ModelSerializer):
    image = Base64ImageField()
    class Meta:
        model = Token
        fields = '__all__'
        read_only_fields = ('id','creator',)  

    def create(self, validated_data):
        request = self.context.get('request')  
        validated_data['creator'] = request.user  
        return super().create(validated_data)
