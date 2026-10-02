import axios from 'axios'

import { obterAccessToken } from '../armazenamento/autenticacao'

export const clienteApi = axios.create({
  baseURL: 'http://localhost:8000/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

clienteApi.interceptors.request.use(
  async (config) => {
    const accessToken = await obterAccessToken()

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (erro) => {
    return Promise.reject(erro)
  },
)
