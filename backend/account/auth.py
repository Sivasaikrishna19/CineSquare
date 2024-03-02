from datetime import datetime, timedelta

from core.errors import ErrorCodes, InvalidAuthentication
from django.apps import apps
from django.core.exceptions import ObjectDoesNotExist
from jwt import DecodeError, ExpiredSignatureError, decode, encode
from rest_framework.authentication import BaseAuthentication, get_authorization_header

from account.models import User, Token


class APIAccessAuthentication(BaseAuthentication):
    # keep these in small case only
    jwt_keyword = "bearer"

    def authenticate(self, request):
        auth = get_authorization_header(request).split()

        if not auth:
            return None

        lower_keyword = auth[0].lower()
        if lower_keyword != self.jwt_keyword.encode():
            return None

        if len(auth) == 1:
            raise InvalidAuthentication(
                "Invalid token header. No credentials provided.", code=ErrorCodes.access_token_invalid
            )
        elif len(auth) > 2:
            raise InvalidAuthentication(
                "Invalid token header. Token string should not contain spaces.", code=ErrorCodes.access_token_invalid
            )

        try:
            token = auth[1].decode()
        except UnicodeError:
            raise InvalidAuthentication(
                "Invalid token header. Token string should not contain invalid characters.",
                code=ErrorCodes.access_token_invalid,
            )

        return self.authenticate_jwt(token)

    def authenticate_jwt(self, token):
        try:
            decoded_token = decode(
                token,
                apps.get_app_config("account").BACKEND_JWT_SECRET,
                audience=apps.get_app_config("account").BACKEND_JWT_AUD,
                algorithms=["HS256"],
            )
        except ExpiredSignatureError:
            raise InvalidAuthentication("Signature expired.", code=ErrorCodes.access_token_expired)
        except DecodeError:
            raise InvalidAuthentication("Malformed token.", code=ErrorCodes.access_token_malformed)

        user_id = decoded_token["user"]
        try:
            user = User.objects.get(id=user_id)
        except ObjectDoesNotExist:
            raise InvalidAuthentication("No such user")

        return (user, token)

    @staticmethod
    def generate_jwt_token(user: User) -> str:
        payload = {
            "user": user.id,
            "aud": apps.get_app_config("account").BACKEND_JWT_AUD,
            "exp": datetime.now() + timedelta(days=60),
        }
        token = encode(payload, apps.get_app_config("account").BACKEND_JWT_SECRET, algorithm="HS256")
        return token
