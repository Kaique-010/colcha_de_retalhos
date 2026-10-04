import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { router, Href } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useEffect, useState, useCallback } from 'react'

import { useAuth } from '../../contextos/AuthContext'
import { useToast } from '../../contextos/ToastContext'

import CardMenu from '../../componentes/CardMenu'
import ReflexaoDiariaCard from '../../componentes/ReflexaoDiariaCard'
import { MetricasCard } from '../../componentes/metricas/MetricasCard'

import { buscarReflexaoDeHoje, ReflexaoDiaria } from '../../servicos/reflexoes'

import { buscarResumoMetricas, ResumoMetricas } from '../../servicos/metricas'

import { getApiError } from '../../servicos/apiError'

type IconeNome = keyof typeof MaterialCommunityIcons.glyphMap

interface OpcaoMenu {
  titulo: string
  descricao: string
  icone: IconeNome
  rota: Href
}

const opcoes: OpcaoMenu[] = [
  {
    titulo: 'Pessoas',
    descricao: 'Gerencie os participantes',
    icone: 'account-group-outline',
    rota: '/pessoas',
  },
  {
    titulo: 'Reuniões',
    descricao: 'Consulte os próximos encontros',
    icone: 'calendar-month-outline',
    rota: '/reunioes',
  },
  {
    titulo: 'Estudos',
    descricao: 'Acesse materiais e conteúdos',
    icone: 'book-open-page-variant-outline',
    rota: '/estudos',
  },
  {
    titulo: 'Financeiro',
    descricao: 'Consulte as movimentações',
    icone: 'finance',
    rota: '/financeiro',
  },
]

export default function InicioScreen() {
  const { usuario, logout } = useAuth()
  const { mostrarToast } = useToast()

  const [resumoMetricas, setResumoMetricas] = useState<ResumoMetricas | null>(
    null,
  )

  const [carregandoMetricas, setCarregandoMetricas] = useState(true)

  const [reflexao, setReflexao] = useState<ReflexaoDiaria | null>(null)

  const [carregandoReflexao, setCarregandoReflexao] = useState(true)

  /*
   * =========================
   * MÉTRICAS
   * =========================
   */

  const carregarMetricas = useCallback(async () => {
    try {
      setCarregandoMetricas(true)

      const dados = await buscarResumoMetricas()

      setResumoMetricas(dados)
    } catch (erro) {
      /*
       * Se não existem métricas ainda,
       * não é exatamente um erro para o usuário.
       */
      if (
        typeof erro === 'object' &&
        erro !== null &&
        'response' in erro &&
        (erro as any).response?.status === 404
      ) {
        setResumoMetricas(null)
        return
      }

      const apiError = getApiError(erro)

      console.error('Erro ao carregar métricas:', apiError)

      mostrarToast(apiError.message, 'erro')
    } finally {
      setCarregandoMetricas(false)
    }
  }, [mostrarToast])

  useEffect(() => {
    carregarMetricas()
  }, [carregarMetricas])

  /*
   * =========================
   * REFLEXÃO DIÁRIA
   * =========================
   */

  useEffect(() => {
    async function carregarReflexao() {
      try {
        setCarregandoReflexao(true)

        const dados = await buscarReflexaoDeHoje()

        setReflexao(dados)
      } catch (erro) {
        const apiError = getApiError(erro)

        console.error('Erro ao carregar reflexão:', apiError)

        setReflexao(null)

        mostrarToast(apiError.message, 'erro')
      } finally {
        setCarregandoReflexao(false)
      }
    }

    carregarReflexao()
  }, [mostrarToast])

  /*
   * =========================
   * LOGOUT
   * =========================
   */

  async function handleLogout() {
    try {
      await logout()

      mostrarToast('Você saiu da sua conta.', 'sucesso')

      /*
       * Só faça isso aqui se o AuthContext
       * NÃO estiver fazendo a navegação.
       */
      router.replace('/login')
    } catch (erro) {
      const apiError = getApiError(erro)

      console.error('Erro ao sair:', apiError)

      mostrarToast(apiError.message, 'erro')
    }
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={handleLogout} style={styles.botaoSair}>
        <Text style={styles.textoBotao}>Sair</Text>
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}>
        {/* CABEÇALHO */}

        <View style={styles.cabecalho}>
          <Text style={styles.titulo}>
            Olá, {usuario?.first_name || usuario?.username}
          </Text>

          <Text style={styles.subtitulo}>O que você deseja fazer hoje?</Text>
        </View>

        {/* MÉTRICAS */}

        <MetricasCard
          resumo={resumoMetricas}
          carregando={carregandoMetricas}
          aoAtualizar={carregarMetricas}
        />

        {/* REFLEXÃO */}

        <View style={styles.secaoReflexao}>
          {carregandoReflexao && (
            <Text style={styles.textoCarregando}>Carregando reflexão...</Text>
          )}

          {!carregandoReflexao && reflexao && (
            <ReflexaoDiariaCard reflexao={reflexao} />
          )}

          {!carregandoReflexao && !reflexao && (
            <Text style={styles.textoErro}>
              Não foi possível carregar a reflexão de hoje.
            </Text>
          )}
        </View>

        {/* MENU */}

        <View style={styles.grade}>
          {opcoes.map((opcao) => (
            <CardMenu
              key={opcao.titulo}
              titulo={opcao.titulo}
              descricao={opcao.descricao}
              icone={opcao.icone}
              onPress={() => router.push(opcao.rota)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4FC',
  },

  conteudo: {
    padding: 20,
    paddingTop: 70,
    paddingBottom: 26,
  },

  cabecalho: {
    marginBottom: 16,
  },

  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#242424',
  },

  subtitulo: {
    fontSize: 12,
    color: '#777',
    marginTop: 8,
  },

  secaoReflexao: {
    marginBottom: 26,
  },

  textoCarregando: {
    fontSize: 12,
    color: '#777',
  },

  textoErro: {
    fontSize: 12,
    color: '#999',
  },

  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  botaoSair: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 10,

    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,

    backgroundColor: '#7C6BC4',
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
})
