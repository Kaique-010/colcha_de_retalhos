import { clienteApi } from '../../src/api/cliente'

export interface ReflexaoDiaria {
  id: number
  data: string
  titulo: string
  conteudo: string
  fonte: string
}

export async function buscarReflexaoDeHoje(): Promise<ReflexaoDiaria> {
  const resposta = await clienteApi.get<ReflexaoDiaria>(
    'reflexoes/reflexoes/hoje/',
  )

  return resposta.data
}
