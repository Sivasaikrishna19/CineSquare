from django.contrib import admin

# Register your models here.
from theater.models import (
    Theater,
    Screen,
)

admin.site.register(Theater)
admin.site.register(Screen)
