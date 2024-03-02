from django.urls import path
from .views import movie_list, movie_detail, MovieCreateView

urlpatterns = [
    path('movies/', movie_list, name='movie_list'),
    path('movies/<int:movie_id>/', movie_detail, name='movie_detail'),
    path('movies/create/', MovieCreateView.as_view(), name='movie_create'),
    # Add other URL patterns as needed
]
