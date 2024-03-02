from django.urls import path
from analytics.views import TheaterOccupancyView


urlpatterns = [
    path("occupancy", TheaterOccupancyView.as_view(), name="theater-occupancy-view"),
]
