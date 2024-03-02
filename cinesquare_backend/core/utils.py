from django.shortcuts import get_object_or_404
from django.http import Http404


def get_object(model_or_queryset, **kwargs):
    """
    Use django's get_object_or_404 because it supports both Model and queryset.
    Catch Http404 and return None.
    """
    try:
        return get_object_or_404(model_or_queryset, **kwargs)
    except Http404:
        return None
