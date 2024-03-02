from django.contrib.gis.db.models import PointField
from common.models import BaseModel
from django.db import models


# Create your models here.
class Theater(BaseModel):
    name = models.CharField(max_length=128)
    location = PointField()
    address = models.CharField(default="")
    short_address = models.CharField(default="")
    zip_code = models.CharField(max_length=8)
    technologies = models.JSONField(default=list)
    cuisines = models.JSONField(default=list)
    shows = models.JSONField(default=list)
    no_of_rows = models.IntegerField(default=0)
    no_of_cols = models.IntegerField(default=0)
    def __str__(self):
        return f"<Theater {self.name}>"
