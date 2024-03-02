from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta, time
from theater.models import Theater
from shows.models import Show
from movie.models import Movie
from movie.serializers import MovieSerializer
from booking.models import Ticket
from theater.serializers import TheaterSerializer
from django.utils import timezone

# Create your views here.
class TheaterOccupancyView(APIView):
    def get(self, request):
        today = timezone.now()
        last_30_days = today - timedelta(days=30)
        last_60_days = today - timedelta(days=60)
        last_90_days = today - timedelta(days=90)

        theaters = Theater.objects.all()
        locations_30_days ={}
        locations_60_days ={}
        locations_90_days ={}
        movies_30_days ={}
        movies_60_days ={}
        movies_90_days ={}
        for theater in theaters:
            shows = Show.objects.filter(theater=theater)
            occupancy_30_days = 0
            occupancy_60_days = 0
            occupancy_90_days = 0
            for ticket in Ticket.objects.filter(show__in=shows, show__show_timing__gte=last_30_days, show__show_timing__lte=today):
                occupancy_30_days += len(ticket.seats)
                if ticket.show.theater.zip_code in locations_30_days:
                    locations_30_days[ticket.show.theater.zip_code] += len(ticket.seats)
                else:
                    locations_30_days[ticket.show.theater.zip_code] = len(ticket.seats)
                if ticket.show.movie.id in movies_30_days:
                    movies_30_days[ticket.show.movie.id] += len(ticket.seats)
                else:
                    movies_30_days[ticket.show.movie.id] = len(ticket.seats)
            for ticket in Ticket.objects.filter(show__in=shows, show__show_timing__gte=last_60_days, show__show_timing__lte=today):
                occupancy_60_days += len(ticket.seats)
                if ticket.show.theater.zip_code in locations_60_days:
                    locations_60_days[ticket.show.theater.zip_code] += len(ticket.seats)
                else:
                    locations_60_days[ticket.show.theater.zip_code] = len(ticket.seats)
                if ticket.show.movie.id in movies_60_days:
                    movies_60_days[ticket.show.movie.id] += len(ticket.seats)
                else:
                    movies_60_days[ticket.show.movie.id] = len(ticket.seats)
            for ticket in Ticket.objects.filter(show__in=shows, show__show_timing__gte=last_90_days, show__show_timing__lte=today):
                occupancy_90_days += len(ticket.seats)
                if ticket.show.theater.zip_code in locations_90_days:
                    locations_90_days[ticket.show.theater.zip_code] += len(ticket.seats)
                else:
                    locations_90_days[ticket.show.theater.zip_code] = len(ticket.seats)
                if ticket.show.movie.id in movies_90_days:
                    movies_90_days[ticket.show.movie.id] += len(ticket.seats)
                else:
                    movies_90_days[ticket.show.movie.id] = len(ticket.seats)
        # for key in locations_30_days.keys():
        #     if key in locations:
        #         locations[key]+=locations_30_days[key]
        #     else:
        #         locations[key]=locations_30_days[key]
        # for key in locations_60_days.keys():
        #     if key in locations:
        #         locations[key]+=locations_60_days[key]
        #     else:
        #         locations[key]=locations_60_days[key]
        # for key in locations_90_days.keys():
        #     if key in locations:
        #         locations[key]+=locations_90_days[key]
        #     else:
        #         locations[key]=locations_90_days[key]

        for key in movies_30_days.keys():
            movie = Movie.objects.get(id=int(key))
            serializer = MovieSerializer(movie)
            movie = serializer.data
            start_date = datetime.strptime(movie["start_date"], "%Y-%m-%d").date()
            if start_date>timezone.now().date():
                movie["type"] = "Upcoming"
            else:
                movie["type"] = "Playing Now"
            movie["occupancy"] = movies_30_days[key]
            movies_30_days[key]=movie
        for key in movies_60_days.keys():
            movie = Movie.objects.get(id=int(key))
            serializer = MovieSerializer(movie)
            movie = serializer.data
            start_date = datetime.strptime(movie["start_date"], "%Y-%m-%d").date()
            if start_date>timezone.now().date():
                movie["type"] = "Upcoming"
            else:
                movie["type"] = "Playing Now"
            movie["occupancy"] = movies_60_days[key]
            movies_60_days[key]=movie
        for key in movies_90_days.keys():
            movie = Movie.objects.get(id=int(key))
            serializer = MovieSerializer(movie)
            movie = serializer.data
            start_date = datetime.strptime(movie["start_date"], "%Y-%m-%d").date()
            if start_date>timezone.now().date():
                movie["type"] = "Upcoming"
            else:
                movie["type"] = "Playing Now"
            movie["occupancy"] = movies_90_days[key]
            movies_90_days[key]=movie

        return Response({"locations_30_days": locations_30_days,"locations_60_days": locations_60_days,"locations_90_days": locations_90_days, "movies_30_days": movies_30_days, "movies_60_days": movies_60_days, "movies_90_days": movies_90_days}, status=status.HTTP_200_OK)