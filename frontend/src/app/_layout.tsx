import { Stack } from 'expo-router'
import { AuthProvider } from '../contextos/AuthContext'
import { ToastProvider } from '../contextos/ToastContext'

export default function RootLayout() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </ToastProvider>
    </AuthProvider>
  )
}