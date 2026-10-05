from django.contrib import admin

# Register your models here.
from estudos.models import Estudos
@admin.register(Estudos)
class EstudosAdmin(admin.ModelAdmin):
    model = Estudos
    list_display = ('user', 'titulo', 'descricao', 'criado_em', 'atualizado_em')
    list_filter_links = ('user',)
    search_fields = ('user__username', 'titulo', 'descricao')
