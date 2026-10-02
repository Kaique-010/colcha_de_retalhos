import { clienteApi } from '../api/cliente'

export interface TipoReuniao {
  id: number
  nome: string
  descricao: string
}

export interface ProgramacaoReuniao {
  tipo_reuniao: TipoReuniao
  hora_inicio: string
  hora_fim: string
  modalidade: string
  local: string | null
  link: string | null
}

export interface DiaReuniao {
  dia_semana: number
  data: string
  programacoes: ProgramacaoReuniao[]
}

export async function buscarCalendario(
  inicio: string,
  fim: string,
): Promise<DiaReuniao[]> {
  const resposta = await clienteApi.get<DiaReuniao[]>('reunioes/calendario/', {
    params: {
      inicio,
      fim,
    },
  })

  return resposta.data
}
