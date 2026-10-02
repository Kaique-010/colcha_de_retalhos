import { Redirect } from 'expo-router'

import { useAuth } from '../../src/contextos/AuthContext'

export default function Index() {
  const { autenticado, carregando } = useAuth()

  if (carregando) {
    return null
  }

  if (autenticado) {
    return <Redirect href="/inicio" />
  }

  return <Redirect href="/login" />
}
