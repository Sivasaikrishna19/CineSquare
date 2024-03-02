from django.urls import path
from account.views import UserLoginAPI, UserSignUpAPI, UserGetUpdateAPI


urlpatterns = [
    path("sign_up", UserSignUpAPI.as_view(), name="sign_up"),
    path("login", UserLoginAPI.as_view(), name="login"),
    path("user/<int:id>", UserGetUpdateAPI.as_view(), name="user-get-update-api")
]
