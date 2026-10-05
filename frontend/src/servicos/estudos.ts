import { clienteApi } from '../api/cliente'

export interface Estudo {
  id: number
  titulo: string
  descricao: string
  conteudo: string
  criado_em: string
  atualizado_em: string
}

export async function buscarEstudos(): Promise<Estudo[]> {
  const resposta = await clienteApi.get<Estudo[]>('estudos/')
  return resposta.data
}

export async function buscarEstudo(id: number): Promise<Estudo> {
  const resposta = await clienteApi.get<Estudo>(`estudos/${id}/`)
  return resposta.data
}
