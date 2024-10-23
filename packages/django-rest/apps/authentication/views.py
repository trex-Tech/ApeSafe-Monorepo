from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken


class UserSignupView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'result': {
                    'id': user.id,
                    'wallet_id': user.wallet_id,
                    'username': user.username
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']

            refresh = RefreshToken.for_user(user)

            return Response({
                'status': 200,
                'success': True,
                'message': 'User successfully logged in.',
                'result': {
                    'id': str(user.id),
                    'username': user.username,
                    'wallet_id': user.wallet_id,
                    'access': str(refresh.access_token),  
                    'refresh': str(refresh)             
                }
            }, status=status.HTTP_200_OK)

        return Response({
            'status': 400,
            'success': False,
            'message': 'Invalid credentials provided.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)