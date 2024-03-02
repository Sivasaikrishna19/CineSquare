from rest_framework import serializers
from django.contrib.gis.geos import Point
from .models import Theater

class PointFieldSerializer(serializers.Field):
    def to_representation(self, value):
        return {"latitude": value.y, "longitude": value.x}

    def to_internal_value(self, data):
        try:
            # Ensure the latitude and longitude are present in the data.
            latitude = float(data['latitude'])
            longitude = float(data['longitude'])
            return Point(longitude, latitude)
        except (TypeError, KeyError):
            raise serializers.ValidationError("Longitude and latitude fields must be included.")

class TheaterSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(max_length=128)
    address = serializers.CharField()
    short_address = serializers.CharField()
    location = PointFieldSerializer()
    zip_code = serializers.CharField(max_length=8)
    technologies = serializers.JSONField(default=list)
    cuisines = serializers.JSONField(default=list)
    shows = serializers.JSONField(default=list)
    no_of_rows = serializers.IntegerField(default=0)
    no_of_cols = serializers.IntegerField(default=0)

    def create(self, validated_data):
        return Theater.objects.create(**validated_data)


class TheaterOutputSerializer(TheaterSerializer):
    id = serializers.IntegerField()


class TheaterUpdateSerializer(TheaterSerializer):
    def update(self, instance, validated_data):
        instance.name = validated_data["name"]
        instance.address = validated_data["address"]
        instance.short_address = validated_data["short_address"]
        instance.location = validated_data["location"]
        instance.zip_code = validated_data["zip_code"]
        instance.technologies = validated_data["technologies"]
        instance.cuisines = validated_data["cuisines"]
        instance.shows = validated_data["shows"]
        instance.no_of_rows = validated_data["no_of_rows"]
        instance.no_of_cols = validated_data["no_of_cols"]
        instance.save()
        return instance


class TheaterFilterSerializer(serializers.Serializer):
        technologies = serializers.ListField(child=serializers.ChoiceField(choices=['xd', 'imax', 'screenx']), required=False)
        food = serializers.ListField(child=serializers.ChoiceField(choices=['restaurant', 'bar']), required=False)