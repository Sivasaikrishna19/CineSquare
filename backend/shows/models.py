from django.db import models
from theater.models import Theater
from movie.models import Movie
import uuid

class Show(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE)
    show_timing = models.DateTimeField()
    seat_matrix = models.JSONField(default=list)  # Assuming a list of strings
    no_of_rows = models.IntegerField()
    no_of_cols = models.IntegerField()
    price = models.FloatField(blank=True, null=True, default=10)
    discounted_price = models.FloatField(blank=True, null=True, default=10)
    def __str__(self):
        return f"{self.movie} at {self.theater} - {self.show_timing}"