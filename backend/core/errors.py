from enum import Enum
from typing import Dict, Optional

from rest_framework import status
from rest_framework.exceptions import APIException, NotFound, ValidationError


class ErrorCodes(str, Enum):
    parameter_invalid_or_missing = 'parameter_invalid_or_missing'
    resource_missing = 'resource_missing'
    resource_already_exists = 'resource_already_exists'
    unauthorized = 'unauthorized'
    permission_denied = 'permission_denied'
    api_token_invalid = 'api_token_invalid'
    access_token_expired = 'access_token_expired'
    access_token_invalid = 'access_token_invalid'
    access_token_malformed = 'access_token_malformed'
    account_deactivated = 'account_deactivated'


class BaseError(Exception):
    """Base class for defining rest errors. All rest error classes should inherit from this class"""

    def __init__(self, error_type: str, message: str, code: Optional[str], status_code: int):
        self.type = error_type
        self.code = code
        self.message = message
        self.status_code = status_code

    def to_json(self):
        result = {
            'success': False,
            'error': {
                'type': self.type,
                'code': self.code,
                'message': self.message,
            },
        }
        if self.code is None:
            result['error'].pop('code')
        return result


class InvalidRequestError(BaseError):
    """This exception can be used for raising any type of client error. Use it when you need full customization
    on error code, status code and message.
    i.e. use it when you cannot use MissingResource, InvalidOrMissingParameter, InvalidAuthentication
    """

    def __init__(
        self,
        message: str,
        code: Optional[str] = None,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        invalid_params: Optional[Dict] = None,
    ) -> None:
        super().__init__('invalid_request_error', message, code, status_code)
        self.invalid_params = invalid_params

    @staticmethod
    def from_validation_error(validation_error: ValidationError):
        """Generate a InvalidRequestError instance from rest_framework's ValidationError"""
        detail = validation_error.detail
        invalid_params = {'non_field_errors': detail}
        if isinstance(detail, dict):
            invalid_params = detail

        for k, v in invalid_params.items():
            if isinstance(v, list) and k != 'non_field_errors':
                invalid_params[k] = v[0]

        if len(invalid_params.keys()) == 1:
            message = list(invalid_params.values())[0]
        else:
            message = 'One or more required fields are missing or invalid'

        return InvalidRequestError(
            code=ErrorCodes.parameter_invalid_or_missing,
            message=message,
            invalid_params=invalid_params,
        )

    @staticmethod
    def from_not_found(not_found_exc: NotFound):
        """Generate a InvalidRequestError instance from rest_framework's NotFound exception"""
        detail = not_found_exc.detail
        message = 'No such resource'
        if isinstance(detail, str):
            message = detail
        return InvalidRequestError(
            message=message, code=ErrorCodes.resource_missing, status_code=status.HTTP_404_NOT_FOUND
        )

    @staticmethod
    def from_client_exception(client_exception: APIException):
        """Generate a InvalidRequestError instance from rest_framework's APIException. This function assumes that this
        exception is ClientException(4xx)"""
        return InvalidRequestError(message=client_exception.detail, status_code=client_exception.status_code)

    def to_json(self):
        result = super().to_json()
        if self.invalid_params:
            result['error']['invalid_params'] = self.invalid_params
        return result


class ApiError(BaseError):
    """This error class should be used raise all server related errors (5xx)"""

    def __init__(
        self,
        message: str = 'Something went wrong on server end',
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
    ) -> None:
        super().__init__('api_error', message, None, status_code)

    @staticmethod
    def from_api_exception(api_exception: APIException):
        """Generate an ApiError instance from rest_framework's APIException"""
        detail = api_exception.detail
        if isinstance(detail, str):
            return ApiError(message=detail, status_code=api_exception.status_code)
        return ApiError()


class MissingResource(InvalidRequestError):
    """This exception should be used for raising resource not found errors"""

    def __init__(self, message: str):
        super().__init__(message, code=ErrorCodes.resource_missing, status_code=status.HTTP_404_NOT_FOUND)


class InvalidOrMissingParameter(InvalidRequestError):
    """This exception should be used for raising errors related to permissions"""

    def __init__(self, message: str = 'One or more required fields are invalid', invalid_params: Optional[Dict] = None):
        super().__init__(
            message,
            code=ErrorCodes.parameter_invalid_or_missing,
            status_code=status.HTTP_400_BAD_REQUEST,
            invalid_params=invalid_params,
        )


class InvalidAuthentication(InvalidRequestError):
    """This exception should be used for raising errors related to authentication"""

    def __init__(self, message: str, code: str = ErrorCodes.unauthorized, status_code=status.HTTP_401_UNAUTHORIZED):
        super().__init__(message, code=code, status_code=status_code)
