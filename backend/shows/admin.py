from django.contrib import admin

# Register your models here.
from shows.models import (
    Show,
)

admin.site.register(Show)
