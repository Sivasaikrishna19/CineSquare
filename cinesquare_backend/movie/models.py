from django.db import models
import uuid

class CastMember(models.Model):
    name = models.CharField(max_length=255)
    featured_as = models.CharField(max_length=255)
    img = models.URLField()

    def __str__(self):
        return self.name

class Movie(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    release_date = models.DateField()
    runtime = models.CharField(max_length=10)
    genre = models.CharField(max_length=255)
    rating = models.FloatField()
    show_timings = models.JSONField(default=list)  # Assuming a list of strings
    description = models.TextField()
    cast = models.ManyToManyField(CastMember)

    def __str__(self):
        return self.name

