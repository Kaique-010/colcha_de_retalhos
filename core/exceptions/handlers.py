import logging

from rest_framework import status
from rest_framework.exceptions import (
    AuthenticationFailed,
    NotAuthenticated,
    PermissionDenied,
    ValidationError,
)
from rest_framework.response import Response
from rest_framework.views import exception_handler

from .codes import ErrorCode
from .messages import ERROR_MESSAGES


logger = logging.getLogger(__name__)


def api_exception_handler(exc, context):

    logger.warning(
        ">>> API EXCEPTION HANDLER: %s",
        type(exc).__name__,
    )

    response = exception_handler(exc, context)

    if response is None:
        logger.exception(
            ">>> ERRO NÃO TRATADO: %s",
            type(exc).__name__,
        )

        return Response(
            {
                "success": False,
                "code": ErrorCode.INTERNAL_ERROR,
                "message": ERROR_MESSAGES[
                    ErrorCode.INTERNAL_ERROR
                ],
                "errors": {},
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if isinstance(exc, ValidationError):
        return Response(
            {
                "success": False,
                "code": ErrorCode.VALIDATION_ERROR,
                "message": ERROR_MESSAGES[
                    ErrorCode.VALIDATION_ERROR
                ],
                "errors": response.data,
            },
            status=response.status_code,
        )

    if isinstance(exc, AuthenticationFailed):
        return Response(
            {
                "success": False,
                "code": ErrorCode.AUTHENTICATION_FAILED,
                "message": ERROR_MESSAGES[
                    ErrorCode.AUTHENTICATION_FAILED
                ],
                "errors": {},
            },
            status=response.status_code,
        )

    if isinstance(exc, NotAuthenticated):
        return Response(
            {
                "success": False,
                "code": ErrorCode.NOT_AUTHENTICATED,
                "message": ERROR_MESSAGES[
                    ErrorCode.NOT_AUTHENTICATED
                ],
                "errors": {},
            },
            status=response.status_code,
        )

    if isinstance(exc, PermissionDenied):
        return Response(
            {
                "success": False,
                "code": ErrorCode.PERMISSION_DENIED,
                "message": ERROR_MESSAGES[
                    ErrorCode.PERMISSION_DENIED
                ],
                "errors": {},
            },
            status=response.status_code,
        )

    return Response(
        {
            "success": False,
            "code": ErrorCode.INTERNAL_ERROR,
            "message": ERROR_MESSAGES[
                ErrorCode.INTERNAL_ERROR
            ],
            "errors": {},
        },
        status=response.status_code,
    )