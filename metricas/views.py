from drf_spectacular.utils import extend_schema

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import (
    ControleConsumoSerializer,
    HistoricoConsumoSerializer,
    ResumoGeralMetricasSerializer,
    ResumoMetricasSerializer,
    PeriodoMetricaSerializer,
)
from .services.metricas import MetricasService


class MetricasViewSet(viewsets.ViewSet):

    @extend_schema(
        responses=ResumoMetricasSerializer,
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="resumo",
    )
    def resumo(self, request):
        resumo = MetricasService.obter_resumo(
            request.user
        )

        if not resumo:
            return Response(
                {
                    "detail": "Controle de consumo não configurado."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ResumoMetricasSerializer(resumo)

        return Response(serializer.data)

    @extend_schema(
        request=ControleConsumoSerializer,
        responses=ControleConsumoSerializer,
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="configurar",
    )
    def configurar(self, request):
        serializer = ControleConsumoSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        controle = MetricasService.criar_controle(
            usuario=request.user,
            data_inicio=serializer.validated_data[
                "data_inicio"
            ],
            gasto_medio_diario=serializer.validated_data[
                "gasto_medio_diario"
            ],
        )

        return Response(
            ControleConsumoSerializer(controle).data,
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        responses=ControleConsumoSerializer,
    )
    @action(
        detail=False,
        methods=["post"],
        url_path="recomecar",
    )
    def recomecar(self, request):
        controle = MetricasService.recomecar(
            request.user
        )

        if not controle:
            return Response(
                {
                    "detail": "Controle de consumo não configurado."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            ControleConsumoSerializer(controle).data,
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        responses=HistoricoConsumoSerializer(many=True),
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="historico",
    )
    def historico(self, request):
        historico = MetricasService.listar_historico(
            request.user
        )

        serializer = HistoricoConsumoSerializer(
            historico,
            many=True,
        )

        return Response(serializer.data)

    @extend_schema(
        responses=ResumoGeralMetricasSerializer,
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="resumo-geral",
    )
    def resumo_geral(self, request):
        resumo = MetricasService.obter_resumo_geral(
            request.user
        )

        serializer = ResumoGeralMetricasSerializer(
            resumo
        )

        return Response(serializer.data)

    @extend_schema(
    responses=PeriodoMetricaSerializer(many=True)
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="periodos",
    )
    def periodos(self, request):
        periodos = MetricasService.obter_periodos(
            request.user
        )

        return Response(
            PeriodoMetricaSerializer(
                periodos,
                many=True,
            ).data
        )