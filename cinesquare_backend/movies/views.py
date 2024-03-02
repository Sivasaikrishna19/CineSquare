from .models import Movie
from .serializers import MovieSerializer, MovieUpdateSerializer, MovieFilterSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import datetime
class MovieGetUpdateDeleteAPI(APIView):
    def get(self, request, pk):
        try:
            movie = Movie.objects.get(id=pk)
            serializer = MovieSerializer(movie)
            movie = serializer.data
            start_date = datetime.strptime(movie["start_date"], "%Y-%m-%d").date()
            if start_date>timezone.now().date():
                movie["type"] = "Upcoming"
            else:
                movie["type"] = "Playing Now"
            return Response({"movie": movie}, status=status.HTTP_200_OK)
        except Movie.DoesNotExist:
            return Response({'message': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request, pk):
        try:
            movie = Movie.objects.get(id=pk)
            serializer = MovieUpdateSerializer(movie, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'movie': serializer.data}, status=status.HTTP_200_OK)
        except Movie.DoesNotExist:
            return Response({'message': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            movie = Movie.objects.get(id=pk)
            movie.delete()
            return Response({'message': 'Movie deleted successfully'})
        except Movie.DoesNotExist:
            return Response({'message': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
    
class MovieListCreateAPI(APIView):
    def get(self, request):
        movies = Movie.objects.all()
        query_params = request.query_params
        serializer = MovieFilterSerializer(data=query_params)
        serializer.is_valid(raise_exception=True)
        filters = serializer.data
        if "genre" in filters:
            movies = movies.filter(genre=filters["genre"])
        if "rating" in filters:
            movies = movies.filter(rating__gte=filters["rating"])
        if "sort_by" in filters:
            if filters["sort_by"]=="recent":
                movies = movies.order_by('start_date')
            if filters["sort_by"]=="popular":
                movies = movies.order_by('-rating')
            if filters["sort_by"]=="alphabetical":
                movies = movies.order_by('name')
        serializer = MovieSerializer(movies, many=True)
        movies = serializer.data
        for movie in movies:
            start_date = datetime.strptime(movie["start_date"], "%Y-%m-%d").date()
            if start_date>timezone.now().date():
                movie["type"] = "Upcoming"
            else:
                movie["type"] = "Playing Now"
        return Response({"movies": movies}, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = MovieSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"movie":serializer.data}, status=status.HTTP_201_CREATED)

