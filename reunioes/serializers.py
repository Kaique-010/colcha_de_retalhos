from rest_framework import serializers

from .models import ProgramacaoReuniao, TipoReuniao


class TipoReuniaoCalendarioSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    nome = serializers.CharField()
    descricao = serializers.CharField(
        allow_null=True,
        allow_blank=True,
    )


class ProgramacaoReuniaoSerializer(serializers.ModelSerializer):

    tipo_reuniao = TipoReuniaoCalendarioSerializer(
        read_only=True,
    )

    class Meta:
        model = ProgramacaoReuniao
        fields = [
            "id",
            "tipo_reuniao",
            "dia_semana",
            "hora_inicio",
            "hora_fim",
            "modalidade",
            "local",
            "link",
            "ativo",
        ]


class ProgramacaoCalendarioSerializer(serializers.Serializer):
    tipo_reuniao = TipoReuniaoCalendarioSerializer()

    hora_inicio = serializers.TimeField(format="%H:%M")

    hora_fim = serializers.TimeField(
        format="%H:%M",
        allow_null=True,
    )

    modalidade = serializers.CharField()

    local = serializers.CharField(
        allow_null=True,
        allow_blank=True,
    )

    link = serializers.URLField(
        allow_null=True,
        allow_blank=True,
    )


class ReuniaoCalendarioSerializer(serializers.Serializer):
    dia_semana = serializers.IntegerField()
    data = serializers.DateField()

    programacoes = ProgramacaoCalendarioSerializer(
        many=True
    )