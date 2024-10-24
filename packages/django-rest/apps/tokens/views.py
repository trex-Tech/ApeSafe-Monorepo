from rest_framework import viewsets
from .models import Token
from .serializers import TokenSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action

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

        response_data = {
            "result": serializer.data,
            "message": "Success",
            "status": status.HTTP_201_CREATED,
            "success": True,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)

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
