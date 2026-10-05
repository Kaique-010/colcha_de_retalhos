import { clienteApi } from '../api/cliente'

export interface Perfil {
  telefone: string | null
  ativo: boolean
}

export interface Usuario {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  is_staff: boolean
  perfil: Perfil | null
}

export async function buscarMeuPerfil(): Promise<Usuario> {
  const resposta = await clienteApi.get<Usuario>('usuarios/me/')
  return resposta.data
}

export async function buscarUsuarios(): Promise<Usuario[]> {
  const resposta = await clienteApi.get<Usuario[]>('usuarios/')
  return resposta.data
}
