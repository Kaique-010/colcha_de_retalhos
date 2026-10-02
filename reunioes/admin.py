from django.contrib import admin

from .models import ProgramacaoReuniao, TipoReuniao


@admin.register(TipoReuniao)
class TipoReuniaoAdmin(admin.ModelAdmin):

    list_display = [
        "nome",
        "ativo",
        "criado_em",
        "atualizado_em",
    ]

    list_filter = [
        "ativo",
    ]

    search_fields = [
        "nome",
        "descricao",
    ]


@admin.register(ProgramacaoReuniao)
class ProgramacaoReuniaoAdmin(admin.ModelAdmin):

    list_display = [
        "tipo_reuniao",
        "dia_semana",
        "hora_inicio",
        "hora_fim",
        "modalidade",
        "ativo",
    ]

    list_filter = [
        "dia_semana",
        "modalidade",
        "ativo",
    ]

    search_fields = [
        "tipo_reuniao__nome",
        "local",
    ]

    autocomplete_fields = [
        "tipo_reuniao",
    ]