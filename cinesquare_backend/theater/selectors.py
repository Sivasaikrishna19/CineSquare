from core.utils import get_object
from theater.models import Theater


def theater_get(**kwargs) -> Theater:
    return get_object(Theater, **kwargs)
