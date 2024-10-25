from rest_framework import serializers
from .models import Token, Chain
from drf_extra_fields.fields import Base64ImageField

class ChainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chain
        fields = '__all__'

class TokenSerializer(serializers.ModelSerializer):
    image = Base64ImageField()
    chains = ChainSerializer(many=True)
    class Meta:
        model = Token
        fields = '__all__'
        read_only_fields = ('id','creator',)  

    def create(self, validated_data):
        request = self.context.get('request')  
        validated_data['creator'] = request.user  
        chains_data = validated_data.pop('chains')
        token = super().create(validated_data)
        for chain_data in chains_data:
            chain, created = Chain.objects.get_or_create(
                name=chain_data.get('name'),
                contract_address=chain_data.get('contract_address'),
            )
            token.chains.add(chain)
        return token
    
    def update(self, instance, validated_data):
        chains_data = validated_data.pop('chains', None)
        instance = super().update(instance, validated_data)

        if chains_data:
            instance.chains.clear() 
            
            for chain_data in chains_data:
                chain, created = Chain.objects.get_or_create(
                    name=chain_data.get('name'),
                    contract_address=chain_data.get('contract_address'),
                )
                instance.chains.add(chain)

        instance.save()
        return instance
