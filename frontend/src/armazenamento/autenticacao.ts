import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

const CHAVE_ACCESS_TOKEN = 'colchaderetalhos_access_token'
const CHAVE_REFRESH_TOKEN = 'colchaderetalhos_refresh_token'

async function salvarItem(chave: string, valor: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem(chave, valor)
    return
  }

  await SecureStore.setItemAsync(chave, valor)
}

async function obterItem(chave: string) {
  if (Platform.OS === 'web') {
    return localStorage.getItem(chave)
  }

  return SecureStore.getItemAsync(chave)
}

async function removerItem(chave: string) {
  if (Platform.OS === 'web') {
    localStorage.removeItem(chave)
    return
  }

  await SecureStore.deleteItemAsync(chave)
}

export async function salvarTokens(accessToken: string, refreshToken: string) {
  await salvarItem(CHAVE_ACCESS_TOKEN, accessToken)
  await salvarItem(CHAVE_REFRESH_TOKEN, refreshToken)
}

export async function obterAccessToken() {
  return obterItem(CHAVE_ACCESS_TOKEN)
}

export async function obterRefreshToken() {
  return obterItem(CHAVE_REFRESH_TOKEN)
}

export async function limparTokens() {
  await removerItem(CHAVE_ACCESS_TOKEN)
  await removerItem(CHAVE_REFRESH_TOKEN)
}
