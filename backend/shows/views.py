# from django.shortcuts import render, get_object_or_404, redirect
# from django.views.generic import CreateView, UpdateView, DeleteView
# from django.urls import reverse_lazy
# from .models import Show
# from .forms import ShowForm

# def show_list(request):
#     shows = Show.objects.all()
#     return render(request, 'show_list.html', {'shows': shows})

# class ShowCreateView(CreateView):
#     model = Show
#     form_class = ShowForm
#     template_name = 'show_form.html'
#     success_url = reverse_lazy('show_list')

# class ShowUpdateView(UpdateView):
#     model = Show
#     form_class = ShowForm
#     template_name = 'show_form.html'
#     success_url = reverse_lazy('show_list')

# class ShowDeleteView(DeleteView):
#     model = Show
#     template_name = 'show_confirm_delete.html'
#     success_url = reverse_lazy('show_list')



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta, time
from .models import Show, Movie, Theater
from movie.serializers import MovieSerializer
from theater.serializers import TheaterSerializer, TheaterOutputSerializer
from django.forms.models import model_to_dict

class CreateShowsView(APIView):
    def post(self, request, format=None):
        data = request.data
        movie_id = data.get('movie_id')
        theater_id_list = data.get('theater_id_list')
        start_date = datetime.fromisoformat(data.get('start_date'))
        end_date = datetime.fromisoformat(data.get('end_date'))
        price = data.get("price", 10)
        discounted_price = data.get("discounted_price", price)

        if not movie_id or not theater_id_list or not start_date or not end_date:
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        date_range = [start_date + timedelta(days=x) for x in range((end_date - start_date).days + 1)]
        shows = []
        for show_date in date_range:
            for theater_id in theater_id_list:
                try:
                    theater = Theater.objects.get(id=theater_id)
                    movie = Movie.objects.get(id=movie_id)
                    for show_time in theater.shows:
                        time_parts = show_time.split(' ')
                        show_time_12hr = datetime.strptime(time_parts[0] + ' ' + time_parts[1], '%I:%M %p').strftime('%I:%M %p')

                        show_datetime = datetime.combine(show_date, datetime.strptime(show_time_12hr, '%I:%M %p').time())
                        seat_matrix = []
                        print(theater, movie)
                        shows.append(model_to_dict(Show.objects.create(movie=movie, theater=theater, show_timing=show_datetime, seat_matrix=seat_matrix, no_of_rows=theater.no_of_rows, no_of_cols=theater.no_of_cols, price=price, discounted_price=discounted_price)))
                except (Movie.DoesNotExist, Theater.DoesNotExist):
                    return Response({'error': f'Movie or Theater with provided ID not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'Shows created successfully', "shows": shows}, status=status.HTTP_201_CREATED)

class ShowGetDeleteAPI(APIView):
    def get(self, request, id, format=None):
        try:
            show = Show.objects.get(id=id)
            movie_serializer = MovieSerializer(show.movie)
            theater_serializer = TheaterOutputSerializer(show.theater)
            print("day: ",show.show_timing.weekday())
            if show.show_timing.weekday()==1 or show.show_timing.time()<time(18,00):
                discounted_price = show.discounted_price
            else:
                discounted_price = show.price
            response_data = {
                "id": show.id,
                "show_timing": show.show_timing,
                "no_of_rows": show.no_of_rows,
                "no_of_cols": show.no_of_cols,
                "price": show.price,
                "discounted_price": discounted_price,
                "movie": movie_serializer.data,
                "theater": theater_serializer.data,
                "seat_matrix": show.seat_matrix,
                "runtime": show.movie.runtime  # Assuming runtime is part of the Movie model
            }
            return Response({"show":response_data})
        except Show.DoesNotExist:
            return Response({'error': 'Show not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, id):
        try:
            show = Show.objects.get(id=id)
            show.delete()
            return Response({'message': 'Show deleted successfully'})
        except Show.DoesNotExist:
            return Response({'message': 'Show not found'}, status=status.HTTP_404_NOT_FOUND)

class ShowsGetByMovieAPI(APIView):
    def get(self, request, movie_id):
        try:
            movie = Movie.objects.get(id=movie_id)
        except Movie.DoesNotExist:
            return Response({'message': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
        query_params = request.query_params
        date_str = query_params.get("date", str(datetime.now().date()))
        date = datetime.strptime(date_str, "%Y-%m-%d")
        shows = Show.objects.filter(show_timing__date=date, movie__id=movie_id).order_by('theater', 'show_timing')
        shows = Show.objects.filter(
            movie_id=movie_id,
            show_timing__date=date
        ).select_related(
            'theater'
        ).order_by('show_timing')

        # Organize shows by theater
        theaters_with_shows = {}
        for show in shows:
            theater_id = show.theater.id

            if theater_id not in theaters_with_shows:
                theaters_with_shows[theater_id] = {
                    'theater': TheaterOutputSerializer(show.theater).data,
                    'shows': []
                }

            theaters_with_shows[theater_id]['shows'].append({
                'id': show.id,
                'show_timing': show.show_timing,
            })

        # Convert the dictionary values to a list
        theaters_with_shows_list = list(theaters_with_shows.values())
        return Response({"movie": MovieSerializer(movie).data, "theaters": theaters_with_shows_list})

class MoviesGetByTheaterAPI(APIView):
    def get(self, request, theater_id):
        try:
            theater = Theater.objects.get(id=theater_id)
        except Theater.DoesNotExist:
            return Response({'message': 'Theater not found'}, status=status.HTTP_404_NOT_FOUND)
        query_params = request.query_params
        date_str = query_params.get("date", str(datetime.now().date()))
        date = datetime.strptime(date_str, "%Y-%m-%d")
        shows = Show.objects.filter(
            theater_id=theater_id,
            show_timing__date=date
        ).select_related(
            'movie'
        ).order_by('show_timing')

        # Organize shows by theater
        movie_with_shows = {}
        for show in shows:
            movie_id = show.movie.id

            if movie_id not in movie_with_shows:
                movie_with_shows[movie_id] = {
                    'movie': MovieSerializer(show.movie).data,
                    'shows': []
                }

            movie_with_shows[movie_id]['shows'].append({
                'id': show.id,
                'show_timing': show.show_timing,
            })

        # Convert the dictionary values to a list
        movie_with_shows_list = list(movie_with_shows.values())
        return Response({"theater": TheaterOutputSerializer(theater).data, "movies": movie_with_shows_list})

class ShowsListAPI(APIView):
    def get(self, request):
        try:
            shows = Show.objects.all().order_by('-show_timing')
            response_datas = []
            count = 0
            for show in shows:
                if count>=10:
                    break
                count+=1
                movie_serializer = MovieSerializer(show.movie)
                theater_serializer = TheaterOutputSerializer(show.theater)
                print("day: ",show.show_timing.weekday())
                if show.show_timing.weekday()==1 or show.show_timing.time()<time(18,00):
                    discounted_price = show.discounted_price
                else:
                    discounted_price = show.price
                response_data = {
                    "id": show.id,
                    "show_timing": show.show_timing,
                    "no_of_rows": show.no_of_rows,
                    "no_of_cols": show.no_of_cols,
                    "price": show.price,
                    "discounted_price": discounted_price,
                    "movie": movie_serializer.data,
                    "theater": theater_serializer.data,
                    "seat_matrix": show.seat_matrix,
                    "runtime": show.movie.runtime  # Assuming runtime is part of the Movie model
                }
                response_datas.append(response_data)
            return Response({"shows":response_datas})
        except Show.DoesNotExist:
            return Response({'error': 'Show not found'}, status=status.HTTP_404_NOT_FOUND)