import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { fazerLogin } from '../servicos/autenticacao'
import {
  obterAccessToken,
  limparTokens,
} from '../armazenamento/autenticacao'

import { clienteApi } from '../api/cliente'
import { Usuario } from '../tipos/usuario'

interface AuthContextoDados {
  usuario: Usuario | null
  autenticado: boolean
  carregando: boolean

  login: (
    username: string,
    password: string,
  ) => Promise<void>

  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextoDados>(
  {} as AuthContextoDados,
)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)

  async function restaurarSessao() {
    try {
      const accessToken = await obterAccessToken()

      if (!accessToken) {
        return
      }

      const resposta = await clienteApi.get<Usuario>(
        '/usuarios/me/',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      setUsuario(resposta.data)
    } catch (erro) {
      await limparTokens()
      setUsuario(null)
    } finally {
      setCarregando(false)
    }
  }

  async function login(
    username: string,
    password: string,
  ) {
    const resposta = await fazerLogin({
      username,
      password,
    })

    setUsuario(resposta.usuario)
  }

  async function logout() {
    await limparTokens()
    setUsuario(null)
  }

  useEffect(() => {
    restaurarSessao()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        usuario,
        autenticado: !!usuario,
        carregando,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}