from django.contrib.gis.geos import Point
from theater.models import Theater, Screen


def theater_create(
    *,
    name: str,
    location: Point,
) -> Theater:
    theater = Theater(
        name=name,
        location=location,
    )
    theater.save()
    return theater


def screen_create(*, name: str, theater_id: int, no_of_rows: int, no_of_cols: int) -> Screen:
    screen = Screen(name=name, theater_id=theater_id, no_of_rows=no_of_rows, no_of_cols=no_of_cols)
    screen.save()
    return screen
