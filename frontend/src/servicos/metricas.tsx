import { clienteApi } from '../api/cliente'

export interface ConfiguracaoMetricas {
  data_inicio: string
  gasto_medio_diario: string
}

export interface PeriodoMetrica {
  id: number | null
  data_inicio: string
  data_fim: string
  dias_sem_consumo: number
  gasto_medio_diario: string
  economizado: string
  atual: boolean
}

export interface ResumoMetricas {
  data_inicio: string
  dias_sem_consumo: number
  gasto_medio_diario: string
  economizado: string
}

export interface HistoricoConsumo {
  id: number
  data_inicio: string
  data_fim: string
  dias_sem_consumo: number
  gasto_medio_diario: string
  economizado: string
}

export interface ResumoGeralMetricas {
  dias_total: number
  economizado_total: string
  media_economizada_diaria: string
  total_ciclos: number
}

export async function buscarResumoMetricas(): Promise<ResumoMetricas> {
  const resposta = await clienteApi.get<ResumoMetricas>('metricas/resumo/')

  return resposta.data
}
export async function buscarPeriodosMetricas(): Promise<PeriodoMetrica[]> {
  const resposta = await clienteApi.get<PeriodoMetrica[]>('metricas/periodos/')

  return resposta.data
}
export async function configurarMetricas(dados: ConfiguracaoMetricas) {
  const resposta = await clienteApi.post('metricas/configurar/', dados)

  return resposta.data
}

export async function recomecarMetricas() {
  const resposta = await clienteApi.post('metricas/recomecar/')

  return resposta.data
}

export async function buscarHistoricoMetricas(): Promise<HistoricoConsumo[]> {
  const resposta = await clienteApi.get<HistoricoConsumo[]>(
    'metricas/historico/',
  )

  return resposta.data
}

export async function buscarResumoGeralMetricas(): Promise<ResumoGeralMetricas> {
  const resposta = await clienteApi.get<ResumoGeralMetricas>(
    'metricas/resumo-geral/',
  )

  return resposta.data
}
