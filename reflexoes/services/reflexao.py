from datetime import date

from ..models import ReflexaoDiaria


class ReflexaoDiariaService:

    @staticmethod
    def buscar_por_data(data: date):
        return (
            ReflexaoDiaria.objects
            .filter(data=data)
            .first()
        )

    @staticmethod
    def buscar_hoje():
        return ReflexaoDiariaService.buscar_por_data(
            date.today()
        )

    @staticmethod
    def listar():
        return ReflexaoDiaria.objects.all()