from rest_framework import serializers


class BaseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()


class RatingSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    rating = serializers.IntegerField()
    created = serializers.DateTimeField()

    def create(self, validated_data):
        return Comment(**validated_data)

    def update(self, instance, validated_data):
        instance.id = validated_data.get('email', instance.email)
        instance.rating = validated_data.get('content', instance.content)
        instance.created = validated_data.get('created', instance.created)
        return instance
