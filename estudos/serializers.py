from rest_framework import serializers
from estudos.models import Estudos


class EstudosSerializer(serializers.ModelSerializer):

    class Meta:
        model = Estudos
        fields = [
            "id",
            "titulo",
            "descricao",
            "conteudo",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = [
            "id",
            "criado_em",
            "atualizado_em",
        ]