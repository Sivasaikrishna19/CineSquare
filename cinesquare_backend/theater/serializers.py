from rest_framework import serializers

from rest_framework import serializers
from theater.models import Theater, Screen
from theater.selectors import theater_get
from core.errors import MissingResource

from django.contrib.gis.geos import Point
from .models import Theater


class PointFieldSerializer(serializers.Field):
    def to_representation(self, value):
        return {"latitude": value.y, "longitude": value.x}

    def to_internal_value(self, data):
        return Point(float(data["longitude"]), float(data["latitude"]))


class TheaterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=128)
    location = PointFieldSerializer()

    def create(self, validated_data):
        return Theater.objects.create(**validated_data)


class ScreenSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=16)
    theater_id = serializers.IntegerField()
    no_of_rows = serializers.IntegerField()
    no_of_cols = serializers.IntegerField()

    def validate(self, attrs):
        attrs = super().validate(attrs)
        theater_id = attrs["theater_id"]
        theater = theater_get(id=theater_id)
        if not theater:
            raise MissingResource(f"Theater {theater_id} not found")
        # attrs["theater"] = theater
        return attrs
