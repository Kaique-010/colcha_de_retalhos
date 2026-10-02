from django.db import models


class TipoReuniao(models.Model):

    nome = models.CharField(
        max_length=150,
        unique=True,
    )

    descricao = models.TextField(
        blank=True,
        null=True,
    )

    imagem = models.ImageField(
        upload_to="reunioes/",
        blank=True,
        null=True,
    )

    ativo = models.BooleanField(
        default=True,
    )

    criado_em = models.DateTimeField(
        auto_now_add=True,
    )

    atualizado_em = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "tipo_reuniao"
        verbose_name = "Tipo de reunião"
        verbose_name_plural = "Tipos de reunião"
        ordering = ["nome"]

    def __str__(self):
        return self.nome


class ProgramacaoReuniao(models.Model):

    class DiaSemana(models.IntegerChoices):
        SEGUNDA = 0, "Segunda-feira"
        TERCA = 1, "Terça-feira"
        QUARTA = 2, "Quarta-feira"
        QUINTA = 3, "Quinta-feira"
        SEXTA = 4, "Sexta-feira"
        SABADO = 5, "Sábado"
        DOMINGO = 6, "Domingo"

    class Modalidade(models.TextChoices):
        ONLINE = "online", "Online"
        PRESENCIAL = "presencial", "Presencial"
        HIBRIDA = "hibrida", "Híbrida"

    tipo_reuniao = models.ForeignKey(
        TipoReuniao,
        on_delete=models.PROTECT,
        related_name="programacoes",
    )

    dia_semana = models.PositiveSmallIntegerField(
        choices=DiaSemana.choices,
    )

    hora_inicio = models.TimeField()

    hora_fim = models.TimeField(
        blank=True,
        null=True,
    )

    modalidade = models.CharField(
        max_length=20,
        choices=Modalidade.choices,
        default=Modalidade.ONLINE,
    )

    local = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    link = models.URLField(
        max_length=500,
        blank=True,
        null=True,
    )

    ativo = models.BooleanField(
        default=True,
    )

    criado_em = models.DateTimeField(
        auto_now_add=True,
    )

    atualizado_em = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "programacao_reuniao"
        verbose_name = "Programação de reunião"
        verbose_name_plural = "Programações de reunião"
        ordering = [
            "dia_semana",
            "hora_inicio",
        ]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "tipo_reuniao",
                    "dia_semana",
                    "hora_inicio",
                ],
                name="unique_programacao_reuniao",
            ),
        ]

    def __str__(self):
        return (
            f"{self.tipo_reuniao.nome} - "
            f"{self.get_dia_semana_display()} "
            f"{self.hora_inicio.strftime('%H:%M')}"
        )