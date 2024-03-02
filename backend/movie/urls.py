from django.urls import path
from movie.views import MovieListCreateAPI, MovieGetUpdateDeleteAPI

urlpatterns = [
    path("movie", MovieListCreateAPI.as_view(), name="movie-list-create-api"),
    path("movie/<int:pk>", MovieGetUpdateDeleteAPI.as_view(), name="movie-get-update-delete-api"),
]
