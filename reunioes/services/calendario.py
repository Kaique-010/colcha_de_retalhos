from datetime import date, timedelta

from reunioes.models import ProgramacaoReuniao


class ReuniaoCalendarioService:

    @staticmethod
    def listar(inicio: date, fim: date):
        if inicio > fim:
            raise ValueError(
                "A data inicial não pode ser maior que a data final."
            )

        programacoes = (
            ProgramacaoReuniao.objects
            .filter(ativo=True)
            .select_related("tipo_reuniao")
            .order_by("dia_semana", "hora_inicio")
        )

        reunioes = []
        data_atual = inicio

        while data_atual <= fim:

            programacoes_do_dia = []

            for programacao in programacoes:

                if programacao.dia_semana != data_atual.weekday():
                    continue

                programacoes_do_dia.append({
                    "tipo_reuniao": {
                        "id": programacao.tipo_reuniao.id,
                        "nome": programacao.tipo_reuniao.nome,
                        "descricao": programacao.tipo_reuniao.descricao,
                    },
                    "hora_inicio": programacao.hora_inicio,
                    "hora_fim": programacao.hora_fim,
                    "modalidade": programacao.modalidade,
                    "local": programacao.local,
                    "link": programacao.link,
                })

            reunioes.append({
                "dia_semana": data_atual.weekday(),
                "data": data_atual,
                "programacoes": programacoes_do_dia,
            })

            data_atual += timedelta(days=1)

        return reunioes