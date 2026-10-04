from rest_framework.exceptions import APIException

from .codes import ErrorCode
from .messages import ERROR_MESSAGES


class BusinessException(APIException):
    status_code = 400
    default_code = ErrorCode.INTERNAL_ERROR
    default_detail = ERROR_MESSAGES[ErrorCode.INTERNAL_ERROR]


class DuplicateResourceException(BusinessException):
    status_code = 409
    default_code = ErrorCode.DUPLICATE_RESOURCE
    default_detail = ERROR_MESSAGES[ErrorCode.DUPLICATE_RESOURCE]