from datetime import date

from rest_framework import status, viewsets
from rest_framework.response import Response

from drf_spectacular.utils import (
    OpenApiParameter,
    OpenApiTypes,
    extend_schema,
)

from .serializers import ReuniaoCalendarioSerializer
from .services.calendario import ReuniaoCalendarioService


class ReuniaoCalendarioViewSet(viewsets.ViewSet):

    serializer_class = ReuniaoCalendarioSerializer

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="inicio",
                type=OpenApiTypes.DATE,
                location=OpenApiParameter.QUERY,
                required=True,
                description="Data inicial do período.",
            ),
            OpenApiParameter(
                name="fim",
                type=OpenApiTypes.DATE,
                location=OpenApiParameter.QUERY,
                required=True,
                description="Data final do período.",
            ),
        ],
        responses=ReuniaoCalendarioSerializer(many=True),
    )
    def list(self, request):

        inicio = request.query_params.get("inicio")
        fim = request.query_params.get("fim")

        if not inicio or not fim:
            return Response(
                {
                    "detail": (
                        "Informe os parâmetros "
                        "'inicio' e 'fim'."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            inicio = date.fromisoformat(inicio)
            fim = date.fromisoformat(fim)

        except ValueError:
            return Response(
                {
                    "detail": (
                        "As datas devem estar no formato "
                        "YYYY-MM-DD."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            reunioes = ReuniaoCalendarioService.listar(
                inicio,
                fim,
            )

        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = ReuniaoCalendarioSerializer(
            reunioes,
            many=True,
        )

        return Response(serializer.data)