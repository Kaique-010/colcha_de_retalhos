from django.db import models


class ReflexaoDiaria(models.Model):
    data = models.DateField(unique=True)
    titulo = models.CharField(max_length=255)
    conteudo = models.TextField()
    fonte = models.URLField(max_length=500)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "reflexao_diaria"
        verbose_name = "Reflexão diária"
        verbose_name_plural = "Reflexões diárias"
        ordering = ["-data"]

    def __str__(self):
        return f"{self.data:%d/%m/%Y} - {self.titulo}"