import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import Toast from '../componentes/Toast'

type ToastTipo = 'erro' | 'sucesso'

interface ToastContextData {
  mostrarToast: (
    mensagem: string,
    tipo?: ToastTipo,
  ) => void

  fecharToast: () => void
}

const ToastContext =
  createContext<ToastContextData | undefined>(
    undefined,
  )

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({
  children,
}: ToastProviderProps) {
  const [visivel, setVisivel] = useState(false)

  const [mensagem, setMensagem] =
    useState('')

  const [tipo, setTipo] =
    useState<ToastTipo>('erro')

  const timer = useRef<
    ReturnType<typeof setTimeout> | null
  >(null)

  const fecharToast = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    setVisivel(false)
  }, [])

  const mostrarToast = useCallback(
    (
      novaMensagem: string,
      novoTipo: ToastTipo = 'erro',
    ) => {
      if (timer.current) {
        clearTimeout(timer.current)
      }

      setMensagem(novaMensagem)
      setTipo(novoTipo)
      setVisivel(true)

      timer.current = setTimeout(() => {
        setVisivel(false)
      }, 3500)
    },
    [],
  )

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [])

  return (
    <ToastContext.Provider
      value={{
        mostrarToast,
        fecharToast,
      }}
    >
      {children}

      <Toast
        visivel={visivel}
        mensagem={mensagem}
        tipo={tipo}
        fechar={fecharToast}
      />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error(
      'useToast deve ser usado dentro de ToastProvider.',
    )
  }

  return context
}