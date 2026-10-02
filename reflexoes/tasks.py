# reflexoes/tasks.py
from celery import shared_task

from .services.scraping import ScrapingReflexaoService


@shared_task
def atualizar_reflexao_diaria():
    reflexao, criada = ScrapingReflexaoService.executar()

    return {
        "id": reflexao.pk,
        "data": reflexao.data.isoformat(),
        "titulo": reflexao.titulo,
        "criada": criada,
    }