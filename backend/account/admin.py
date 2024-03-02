from django.contrib import admin

# Register your models here.
from account.models import (
    User,
    Token,
)


# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    search_fields = ["id", "email", "username", "role", "phoneNumber"]
    list_display = ("id", "email", "username", "role", "phoneNumber")


@admin.register(Token)
class TokenAdmin(admin.ModelAdmin):
    search_fields = ["user_id", "key"]
    list_display = ("user_id", "key")
