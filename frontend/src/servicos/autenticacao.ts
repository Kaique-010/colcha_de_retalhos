import { clienteApi } from '../api/cliente'
import {
  salvarTokens,
  obterRefreshToken,
  limparTokens,
} from '../armazenamento/autenticacao'

interface LoginDados {
  username: string
  password: string
}

interface LoginResposta {
  access: string
  refresh: string
  usuario: {
    id: number
    username: string
    first_name: string
    last_name: string
    email: string
  }
}

interface CadastroDados {
  username: string
  first_name: string
  last_name: string
  email: string
  telefone: string
  password: string
  password_confirmacao: string
}

export async function fazerCadastro(dados: CadastroDados) {
  const resposta = await clienteApi.post('/autenticacao/cadastro/', dados)

  return resposta.data
}

export async function fazerLogin(dados: LoginDados) {
  const resposta = await clienteApi.post<LoginResposta>(
    '/autenticacao/login/',
    dados,
  )

  const { access, refresh } = resposta.data

  await salvarTokens(access, refresh)

  return resposta.data
}

export async function renovarToken() {
  const refreshToken = await obterRefreshToken()

  if (!refreshToken) {
    throw new Error('Refresh token não encontrado.')
  }

  const resposta = await clienteApi.post<{
    access: string
    refresh?: string
  }>('/autenticacao/refresh/', {
    refresh: refreshToken,
  })

  const novoAccess = resposta.data.access

  const novoRefresh = resposta.data.refresh ?? refreshToken

  await salvarTokens(novoAccess, novoRefresh)

  return novoAccess
}
