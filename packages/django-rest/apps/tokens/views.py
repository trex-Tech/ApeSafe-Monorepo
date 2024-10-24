from rest_framework import viewsets
from .models import Token
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

        response_data = {
            "result": serializer.data,
            "message": "Success",
            "status": status.HTTP_201_CREATED,
            "success": True,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)