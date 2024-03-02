from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

class UserRegistrationView(APIView):
    def post(self, request):
        user_data_serializer = UserSerializer(data=request.data)
        if user_data_serializer.is_valid():
            user_instance = user_data_serializer.save()
            if user_instance:
                return Response(user_data_serializer.data, status=status.HTTP_201_CREATED)
        return Response(user_data_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from django.contrib.auth import authenticate
from .serializers import UserLoginSerializer

class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        login_serializer = self.get_serializer(data=request.data)
        if login_serializer.is_valid():
            user = authenticate(username=login_serializer.validated_data['username'], password=login_serializer.validated_data['password'])
            if user:
                refresh_token = RefreshToken.for_user(user)
                return Response({
                    'refresh_token': str(refresh_token),
                    'access_token': str(refresh_token.access_token),
                })
            return Response({"error": "Incorrect login details"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(login_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
