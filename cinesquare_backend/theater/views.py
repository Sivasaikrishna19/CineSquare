from theater.serializers import TheaterSerializer, ScreenSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from theater.models import Theater, Screen
from core.mixins import ApiAuthenticationMixin
from theater.services import theater_create, screen_create


class TheaterCreateAPI(ApiAuthenticationMixin, APIView):
    Serializer = TheaterSerializer

    def post(self, request):
        serializer = self.Serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        # theater = serializer.create(data)
        theater = theater_create(**data)
        return Response({"theater": self.Serializer(instance=theater).data}, status=status.HTTP_201_CREATED)


class ScreenCreateAPI(ApiAuthenticationMixin, APIView):
    Serializer = ScreenSerializer

    def post(self, request):
        serializer = self.Serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        screen = screen_create(**data)
        return Response({"screen": self.Serializer(instance=screen).data}, status=status.HTTP_201_CREATED)
