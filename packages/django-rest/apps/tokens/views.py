from rest_framework import viewsets
from .models import Token, Chain
from .serializers import TokenSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

class TokenViewSet(viewsets.ModelViewSet):
    queryset = Token.objects.all()
    serializer_class = TokenSerializer
    permission_classes = [IsAuthenticated]  

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        user = request.user  

        chains_data = request.data.get('chains', [])
        chains = []
        for chain_data in chains_data:
            chain, created = Chain.objects.get_or_create(
                name=chain_data.get('name'),
                contract_address=chain_data.get('contract_address'),
            )
            chains.append(chain)

        serializer.instance.chains.set(chains)

        response_data = {
            "result": serializer.data,
            "message": "Success",
            "status": status.HTTP_201_CREATED,
            "success": True,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        chains_data = request.data.get('chains', [])
        chains = []
        for chain_data in chains_data:
            chain, created = Chain.objects.get_or_create(
                name=chain_data.get('name'),
                contract_address=chain_data.get('contract_address'),
            )
            chains.append(chain)

        serializer.instance.chains.set(chains)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)