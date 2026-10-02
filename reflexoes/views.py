from datetime import date

from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from drf_spectacular.utils import (
    OpenApiParameter,
    OpenApiTypes,
    extend_schema,
)

from .serializers import ReflexaoDiariaSerializer
from .services.reflexao import ReflexaoDiariaService


class ReflexaoDiariaViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ReflexaoDiariaSerializer

    def get_queryset(self):
        return ReflexaoDiariaService.listar()

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="data",
                type=OpenApiTypes.DATE,
                location=OpenApiParameter.QUERY,
                required=True,
                description="Data da reflexão no formato YYYY-MM-DD.",
            )
        ],
        responses=ReflexaoDiariaSerializer,
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="por-data",
    )
    def buscar_por_data(self, request):
        data = request.query_params.get("data")

        if not data:
            return Response(
                {"detail": "Informe o parâmetro 'data'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            data = date.fromisoformat(data)
        except ValueError:
            return Response(
                {"detail": "A data deve estar no formato YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reflexao = ReflexaoDiariaService.buscar_por_data(data)

        if not reflexao:
            return Response(
                {"detail": "Reflexão não encontrada."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            self.get_serializer(reflexao).data
        )

    @extend_schema(
        responses=ReflexaoDiariaSerializer,
    )
    @action(
        detail=False,
        methods=["get"],
    )
    def hoje(self, request):
        reflexao = ReflexaoDiariaService.buscar_por_data(
            timezone.localdate()
        )

        if not reflexao:
            return Response(
                {"detail": "Reflexão de hoje não encontrada."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            self.get_serializer(reflexao).data
        )