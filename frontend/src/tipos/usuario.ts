export interface Usuario {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  is_staff: boolean
  perfil: {
    telefone: string | null
    ativo: boolean
  } | null
}
