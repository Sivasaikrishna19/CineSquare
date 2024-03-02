from django.urls import path
from theater.views import TheaterCreateAPI, ScreenCreateAPI


urlpatterns = [
    path("theater", TheaterCreateAPI.as_view(), name="theater-create-api"),
    path("screen", ScreenCreateAPI.as_view(), name="screen-create-api"),
]
