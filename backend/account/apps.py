from django.apps import AppConfig


class AccountConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "account"
    BACKEND_JWT_SECRET = "202"
    BACKEND_JWT_AUD = "team_project"
