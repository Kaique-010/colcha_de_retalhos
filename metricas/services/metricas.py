from decimal import Decimal

from django.utils import timezone

from ..models import (
    ControleConsumo,
    HistoricoConsumo,
)


class MetricasService:

    @staticmethod
    def obter(usuario):
        return ControleConsumo.objects.filter(
            usuario=usuario
        ).first()

    @staticmethod
    def criar_controle(
        usuario,
        data_inicio,
        gasto_medio_diario,
    ):
        controle, _ = ControleConsumo.objects.update_or_create(
            usuario=usuario,
            defaults={
                "data_inicio": data_inicio,
                "gasto_medio_diario": gasto_medio_diario,
            },
        )

        return controle

    @staticmethod
    def obter_resumo(usuario):
        controle = MetricasService.obter(usuario)

        if not controle:
            return None

        hoje = timezone.localdate()

        dias_sem_consumo = (
            hoje - controle.data_inicio
        ).days + 1

        economizado = (
            Decimal(dias_sem_consumo)
            * controle.gasto_medio_diario
        )

        return {
            "data_inicio": controle.data_inicio,
            "dias_sem_consumo": dias_sem_consumo,
            "gasto_medio_diario": controle.gasto_medio_diario,
            "economizado": economizado,
        }

    @staticmethod
    def listar_historico(usuario):
        return HistoricoConsumo.objects.filter(
            usuario=usuario
        )

    @staticmethod
    def obter_periodos(usuario):
        """
        Retorna todos os períodos que devem aparecer
        no gráfico:

        - ciclos encerrados do histórico
        - ciclo atual até hoje
        """

        periodos = []

        historico = MetricasService.listar_historico(usuario)

        for item in historico:
            periodos.append({
                "id": item.id,
                "data_inicio": item.data_inicio,
                "data_fim": item.data_fim,
                "dias_sem_consumo": item.dias_sem_consumo,
                "gasto_medio_diario": item.gasto_medio_diario,
                "economizado": item.economizado,
                "atual": False,
            })

        controle = MetricasService.obter(usuario)

        if controle:
            hoje = timezone.localdate()

            dias_sem_consumo = (
                hoje - controle.data_inicio
            ).days + 1

            economizado = (
                Decimal(dias_sem_consumo)
                * controle.gasto_medio_diario
            )

            periodos.append({
                "id": None,
                "data_inicio": controle.data_inicio,
                "data_fim": hoje,
                "dias_sem_consumo": dias_sem_consumo,
                "gasto_medio_diario": controle.gasto_medio_diario,
                "economizado": economizado,
                "atual": True,
            })

        return periodos

    @staticmethod
    def obter_resumo_geral(usuario):
        historico = MetricasService.listar_historico(usuario)
        controle = MetricasService.obter(usuario)

        dias_historico = sum(
            item.dias_sem_consumo
            for item in historico
        )

        economizado_historico = sum(
            (
                item.economizado
                for item in historico
            ),
            Decimal("0.00"),
        )

        resumo_atual = MetricasService.obter_resumo(usuario)

        if resumo_atual:
            dias_total = (
                dias_historico
                + resumo_atual["dias_sem_consumo"]
            )

            economizado_total = (
                economizado_historico
                + resumo_atual["economizado"]
            )
        else:
            dias_total = dias_historico
            economizado_total = economizado_historico

        if dias_total:
            media_economizada_diaria = (
                economizado_total
                / Decimal(dias_total)
            )
        else:
            media_economizada_diaria = Decimal("0.00")

        return {
            "dias_total": dias_total,
            "economizado_total": economizado_total,
            "media_economizada_diaria": media_economizada_diaria,
            "total_ciclos": historico.count()
            + (1 if controle else 0),
        }

    @staticmethod
    def recomecar(usuario):
        controle = MetricasService.obter(usuario)

        if not controle:
            return None

        hoje = timezone.localdate()

        dias_sem_consumo = (
            hoje - controle.data_inicio
        ).days + 1

        economizado = (
            Decimal(dias_sem_consumo)
            * controle.gasto_medio_diario
        )

        HistoricoConsumo.objects.create(
            usuario=usuario,
            data_inicio=controle.data_inicio,
            data_fim=hoje,
            dias_sem_consumo=dias_sem_consumo,
            gasto_medio_diario=controle.gasto_medio_diario,
            economizado=economizado,
        )

        controle.data_inicio = hoje

        controle.save(
            update_fields=[
                "data_inicio",
                "atualizado_em",
            ]
        )

        return controle