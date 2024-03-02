from django.db import models
import uuid
from django.utils import timezone

class CastMember(models.Model):
    name = models.CharField(max_length=255)
    featured_as = models.CharField(max_length=255)
    img = models.URLField()  # Assuming the image is hosted online

    def __str__(self):
        return self.name

class Movie(models.Model):
    name = models.CharField(max_length=255)
    runtime = models.IntegerField()
    genre = models.CharField(max_length=255, default='Default Genre')
    start_date = models.DateField(default=timezone.now)
    rating = models.FloatField()
    description = models.TextField()
    image_url = models.URLField(null=True, blank=True, max_length=500)

    def __str__(self):
        return self.name

