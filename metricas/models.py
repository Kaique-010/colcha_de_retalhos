from django.contrib.auth.models import User
from django.db import models


class ControleConsumo(models.Model):
    usuario = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="controle_consumo",
    )
    data_inicio = models.DateField()
    gasto_medio_diario = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "controle_consumo"

    def __str__(self):
        return self.usuario.username


class HistoricoConsumo(models.Model):
    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="historico_consumo",
    )

    data_inicio = models.DateField()
    data_fim = models.DateField()

    dias_sem_consumo = models.PositiveIntegerField()

    gasto_medio_diario = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    economizado = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    criado_em = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "historico_consumo"
        verbose_name = "Histórico de consumo"
        verbose_name_plural = "Históricos de consumo"
        ordering = ["-data_inicio"]

    def __str__(self):
        return (
            f"{self.usuario.username} - "
            f"{self.data_inicio} até {self.data_fim}"
        )