from django.contrib.auth.models import User
from django.db import models



class Perfil(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    telefone = models.CharField(max_length=11, blank=True, null=True)
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'perfil'
        verbose_name = 'Perfil'
        verbose_name_plural = 'Perfis'
    
    def __str__(self):
        return self.usuario.username   



