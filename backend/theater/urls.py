from django.urls import path
from theater.views import TheaterListCreateAPI, TheaterGetUpdateDeleteAPI


urlpatterns = [
    path("theater", TheaterListCreateAPI.as_view(), name="theater-list-create-api"),
    path("theater/<int:pk>", TheaterGetUpdateDeleteAPI.as_view(), name="theater-get-update-delete-api"),
]
