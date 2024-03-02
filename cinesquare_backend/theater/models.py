from django.contrib.gis.db.models import PointField
from common.models import BaseModel
from django.db import models


# Create your models here.
class Theater(BaseModel):
    name = models.CharField(max_length=128)
    location = PointField()

    def __str__(self):
        return f"<Theater {self.name}>"


class Screen(BaseModel):
    name = models.CharField(max_length=16)
    theater = models.ForeignKey(Theater, on_delete=models.CASCADE)
    no_of_rows = models.IntegerField()
    no_of_cols = models.IntegerField()

    def __str__(self):
        return f"<Screen {self.name} | {self.theatre.name}>"
