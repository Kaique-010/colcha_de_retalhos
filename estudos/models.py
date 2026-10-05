from django.db import models
from django.contrib.auth.models import User


class Estudos(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=120)
    descricao = models.CharField(max_length=255)
    conteudo = models.TextField()
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'estudos'
        verbose_name = 'Estudo'
        verbose_name_plural = 'Estudos'
    
    def __str__(self):
        return f"{self.user.username} - {self.titulo}"
