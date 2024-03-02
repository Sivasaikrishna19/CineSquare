from account.serializers import SignUpSerializer, LoginSerializer, UserSerializer
from account.auth import APIAccessAuthentication
from theater.serializers import TheaterOutputSerializer
from movie.serializers import MovieSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from account.models import Token, User
from booking.models import Ticket
from booking.serializers import TicketSerializer
from django.utils import timezone


class UserSignUpAPI(APIView):
    InputSerializer = SignUpSerializer

    def post(self, request):
        data = request.data
        user_data = data
        if "password" not in data:
            user_data = {}
            user_data["email"] = data["email"]
            user_data["phoneNumber"] = data["phoneNumber"]
            user_data["username"] = data["username"]
            user_data["role"] = User.GUEST_USER
            user_data["rewardPoints"] = 0
            user_data["is_admin"] = False
            user_data["password"] = "cmpe2020GuestUser"
            user_data["confirm_password"] = "cmpe2020GuestUser"
        serializer = self.InputSerializer(data=user_data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        Token.objects.get_or_create(user=user)
        return Response(
            {
                "success": True,
                "id": user.id,
                "token": APIAccessAuthentication.generate_jwt_token(user),
                "email": user.email,
                "role": user.role,
                "username": user.username,
                "phoneNumber": str(user.phoneNumber),
                "is_admin": user.is_admin,
                **UserSerializer(instance=user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class UserLoginAPI(APIView):
    InputSerializer = LoginSerializer

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            {
                "success": True,
                "id": serializer.validated_data["user"].id,
                "token": APIAccessAuthentication.generate_jwt_token(serializer.validated_data["user"]),
                "email": serializer.validated_data["user"].email,
                "role": serializer.validated_data["user"].role,
                "username": serializer.validated_data["user"].username,
                "phoneNumber": str(serializer.validated_data["user"].phoneNumber),
                "is_admin": serializer.validated_data["user"].is_admin,
                **(UserSerializer(instance=serializer.validated_data["user"]).data),
            },
            status=status.HTTP_200_OK,
        )

class UserGetUpdateAPI(APIView):
    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({'error': 'Invalid User ID'}, status=status.HTTP_404_NOT_FOUND)
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
        tickets = Ticket.objects.filter(user=user).filter(created_at__gte=thirty_days_ago).select_related('show')
        tickets_data = TicketSerializer(tickets, many=True).data
        for i, ticket in enumerate(tickets):
            show_data = {
                "id": ticket.show.id,
                "show_timing": ticket.show.show_timing,
                "runtime": ticket.show.movie.runtime  # Assuming runtime is part of the Movie model
            }
            tickets_data[i]["theater"] = TheaterOutputSerializer(ticket.show.theater).data
            tickets_data[i]["movie"] = MovieSerializer(ticket.show.movie).data
            tickets_data[i]["show"] = show_data

        data = {
            "user": UserSerializer(user).data,
            "tickets": tickets_data,
        }
        return Response(data, status=status.HTTP_200_OK)
    def patch(self, request, id):
        data = request.data
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({'error': 'Invalid User ID'}, status=status.HTTP_404_NOT_FOUND)
        user.membership_type = data.get("membership_type", user.membership_type)
        user.save()
        return Response(
            {
                "success": True,
                "id": user.id,
                "token": APIAccessAuthentication.generate_jwt_token(user),
                "email": user.email,
                "role": user.role,
                "username": user.username,
                "phoneNumber": str(user.phoneNumber),
                "is_admin": user.is_admin,
                **(UserSerializer(instance=user).data),
            },
            status=status.HTTP_200_OK,
        )
