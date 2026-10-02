from rest_framework import serializers

from .models import ReflexaoDiaria


class ReflexaoDiariaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReflexaoDiaria
        fields = [
            "id",
            "data",
            "titulo",
            "conteudo",
            "fonte",
        ]