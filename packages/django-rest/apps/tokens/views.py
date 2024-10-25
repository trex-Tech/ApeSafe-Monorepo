from rest_framework import viewsets
from .models import Token, Chain
from .serializers import TokenSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.db.models import Q


response_data = {
    "result": [],
    "message": "Success",
    "status": "",
    "success": True,
}


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
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        chains_data = request.data.get('chains', [])
        if chains_data:
            new_chains = []
            for chain_data in chains_data:
                chain, created = Chain.objects.get_or_create(
                    name=chain_data.get('name'),
                    contract_address=chain_data.get('contract_address'),
                )
                new_chains.append(chain)

            instance.chains.add(*new_chains)

        serializer.save()
        
        response_data.update({
            "result": serializer.data,
            "message": "Token updated successfully",
            "status": status.HTTP_200_OK,
            "success": True
        })
        
        return Response(response_data, status=status.HTTP_200_OK)

    
  
    def list(self, request, *args, **kwargs):

        search_query = self.request.GET.get('search', '')

        if search_query:
            get_search = queryset.objects.filter(
                Q(name__icontains=search_query) | Q(description__icontains=search_query))
            seriailizer = self.get_serializer(get_search, many=True)
            response_data['result'] = seriailizer.data
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            get_all = queryset.objects.all()
            seriailizer = self.get_serializer(get_all, many=True)
            response_data['result'] = seriailizer.data
            response_data['status'] = status.HTTP_200_OK
            return Response(response_data, status=status.HTTP_200_OK)

        return Response({"error": "something went wrong!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
