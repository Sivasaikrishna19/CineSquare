from rest_framework import serializers
from .models import  Movie

class MovieSerializer(serializers.ModelSerializer):

    class Meta:
        model = Movie
        fields = ['id', 'name', 'runtime', 'genre', 'rating', 'description', 'image_url', 'start_date']

    def create(self, validated_data):
        movie = Movie.objects.create(**validated_data)
        # for cast_member_data in cast_data:
        #     cast_member, created = CastMember.objects.get_or_create(**cast_member_data)
        #     movie.cast.add(cast_member)
        return movie


class MovieUpdateSerializer(MovieSerializer):
    def update(self, instance, validated_data):
        instance.name = validated_data["name"]
        instance.runtime = validated_data["runtime"]
        instance.genre = validated_data["genre"]
        instance.rating = validated_data["rating"]
        instance.description = validated_data["description"]
        instance.image_url = validated_data["image_url"]
        instance.start_date = validated_data["start_date"]
        instance.save()
        return instance
    
class MovieFilterSerializer(serializers.Serializer):
        sort_by = serializers.ChoiceField(choices=['recent', 'popular', 'alphabetical'], required=False)
        genre = serializers.ChoiceField(choices=['thriller', 'horror', 'rom_com', 'feel_good', 'action'], required=False)
        rating = serializers.IntegerField(required=False)