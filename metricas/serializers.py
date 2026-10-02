from rest_framework import serializers

from .models import ControleConsumo, HistoricoConsumo


class ControleConsumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControleConsumo
        fields = [
            "id",
            "data_inicio",
            "gasto_medio_diario",
        ]


class ResumoMetricasSerializer(serializers.Serializer):
    data_inicio = serializers.DateField()
    dias_sem_consumo = serializers.IntegerField()
    gasto_medio_diario = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
    economizado = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )


class ResumoGeralMetricasSerializer(serializers.Serializer):
    dias_total = serializers.IntegerField()

    economizado_total = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    media_economizada_diaria = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    total_ciclos = serializers.IntegerField()

class HistoricoConsumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricoConsumo
        fields = [
            "id",
            "data_inicio",
            "data_fim",
            "dias_sem_consumo",
            "gasto_medio_diario",
            "economizado",
        ]


class PeriodoMetricaSerializer(serializers.Serializer):
    id = serializers.IntegerField(
        allow_null=True
    )

    data_inicio = serializers.DateField()

    data_fim = serializers.DateField()

    dias_sem_consumo = serializers.IntegerField()

    gasto_medio_diario = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    economizado = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    atual = serializers.BooleanField()