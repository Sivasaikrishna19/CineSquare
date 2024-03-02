from django.urls import path
from .views import CreateShowsView, ShowGetDeleteAPI, ShowsGetByMovieAPI, MoviesGetByTheaterAPI, ShowsListAPI

urlpatterns = [
    path('create/shows', CreateShowsView.as_view(), name='create-shows'),
    path('show/<int:id>', ShowGetDeleteAPI.as_view(), name='show-get-delete-api'),
    path('shows', ShowsListAPI.as_view(), name='shows-list-api'),
    path('get-shows/<int:movie_id>', ShowsGetByMovieAPI.as_view(), name='get-shows-by-movie-id'),
    path('get-movies/<int:theater_id>', MoviesGetByTheaterAPI.as_view(), name='get-movies-by-theater-id')
]
