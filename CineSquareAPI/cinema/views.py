from rest_framework import viewsets
from .models import CustomUser, Theater, Movie, Show, Ticket
from .serializers import UserSerializer, TheaterSerializer, MovieSerializer, ShowSerializer, TicketSerializer, LoginSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class TheaterViewSet(viewsets.ModelViewSet):
    queryset = Theater.objects.all()
    serializer_class = TheaterSerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

class ShowViewSet(viewsets.ModelViewSet):
    queryset = Show.objects.all()
    serializer_class = ShowSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password

class RegisterViewSet(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from django.contrib.auth import authenticate
from .serializers import LoginSerializer

class LoginViewSet(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(username=serializer.validated_data['username'], password=serializer.validated_data['password'])
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from rest_framework.decorators import api_view


@api_view(['GET'])
def get_theaters_for_movie(request):
  data = request.data
  try:
    movie = Movie.objects.get(pk=data['movie_id'])
  except Movie.DoesNotExist:
    return Response({"error": "Movie not found"}, status=404)
  
  theaters = Theater.objects.filter(movie=movie)
  serializer = TheaterSerializer(theaters, many=True)
  return Response(serializer.data)

@api_view(['GET'])
def get_theaters():
  theaters = Theater.objects.all()
  serializer = TheaterSerializer(theaters, many=True)
  return Response(serializer.data)

@api_view(['POST'])
def create_theater(request):
  serializer = TheaterSerializer(data=request.data)
  if serializer.is_valid():
    theater = serializer.save()
    return Response(serializer.data, status=201)
  return Response(serializer.errors, status=400)

@api_view(['PUT'])
def update_theater(request, theater_id):
  theater = Theater.objects.get(pk=theater_id)
  serializer = TheaterSerializer(theater, data=request.data)
  if serializer.is_valid():
    serializer.save()
    return Response(serializer.data)
  return Response(serializer.errors, status=400) 

@api_view(['DELETE'])
def delete_theater(request, theater_id):
  theater = Theater.objects.get(pk=theater_id)
  theater.delete()
  return Response(status=204)

# Showtimes 

@api_view(['GET'])
def get_showtimes():
  showtimes = Showtime.objects.all()
  serializer = ShowtimeSerializer(showtimes, many=True) 
  return Response(serializer.data)

@api_view(['GET'])
def get_showtime(request, showtime_id):
  showtime = get_object_or_404(Showtime, pk=showtime_id)
  serializer = ShowtimeSerializer(showtime)
  return Response(serializer.data)

@api_view(['POST'])
def create_showtime(request):
  serializer = ShowtimeSerializer(data=request.data)
  if serializer.is_valid():
    showtime = serializer.save()
    return Response(serializer.data, status=201)
  return Response(serializer.errors, status=400)

@api_view(['PUT'])  
def update_showtime(request, showtime_id):
  showtime = get_object_or_404(Showtime, pk=showtime_id)
  serializer = ShowtimeSerializer(showtime, data=request.data)
  if serializer.is_valid():
    serializer.save()
    return Response(serializer.data)
  return Response(serializer.errors, status=400)   

@api_view(['DELETE'])
def delete_showtime(request, showtime_id):
  showtime = get_object_or_404(Showtime, pk=showtime_id)
  showtime.delete()
  return Response(status=204)

# Bookings APIs 

@api_view(['GET'])
def get_bookings(request):
  bookings = Booking.objects.filter(user=request.user)
  serializer = BookingSerializer(bookings, many=True)
  return Response(serializer.data)

@api_view(['POST'])
def create_booking(request):
  # booking create logic
  pass

@api_view(['PUT'])
def update_booking(request, booking_id):
  # booking update logic
  pass
  
@api_view(['DELETE'])  
def cancel_booking(request, booking_id):
  # cancel booking logic
  pass


# Movies APIs

@api_view(['GET'])  
def get_movies():
  movies = Movie.objects.all()
  serializer = MovieSerializer(movies, many=True)
  return Response(serializer.data)  

@api_view(['GET']) 
def get_movie(request, movie_id):
  movie = get_object_or_404(Movie, pk=movie_id)
  serializer = MovieSerializer(movie)
  return Response(serializer.data)

@api_view(['POST'])
def create_movie(request):
  serializer = MovieSerializer(data=request.data)
  if serializer.is_valid():
    movie = serializer.save()
    return Response(serializer.data, status=201)
  return Response(serializer.errors, status=400)

@api_view(['PUT']) 
def update_movie(request, movie_id):
  movie = get_object_or_404(Movie, pk=movie_id)
  serializer = MovieSerializer(movie, data=request.data) 
  if serializer.is_valid():
    serializer.save()
    return Response(serializer.data)
  return Response(serializer.errors, status=400)
  
@api_view(['DELETE'])
def delete_movie(request, movie_id):
  movie = get_object_or_404(Movie, pk=movie_id)
  movie.delete()
  return Response(status=204)