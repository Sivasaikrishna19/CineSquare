from account.auth import APIAccessAuthentication
from core.renderers import StandardJSONResponseRenderer
from rest_framework.permissions import IsAuthenticated


class ApiAuthenticationMixin:
    permission_classes = (IsAuthenticated,)
    authentication_classes = (APIAccessAuthentication,)
    renderer_classes = (StandardJSONResponseRenderer,)
