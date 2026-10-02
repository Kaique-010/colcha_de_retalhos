import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { router, Href } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useEffect, useState, useCallback } from 'react'

import { useAuth } from '../../contextos/AuthContext'
import CardMenu from '../../componentes/CardMenu'
import ReflexaoDiariaCard from '../../componentes/ReflexaoDiariaCard'
import { buscarReflexaoDeHoje, ReflexaoDiaria } from '../../servicos/reflexoes'
import { buscarResumoMetricas, ResumoMetricas } from '../../servicos/metricas'
import { MetricasCard } from '../../componentes/metricas/MetricasCard'

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
  const [resumoMetricas, setResumoMetricas] = useState<ResumoMetricas | null>(
    null,
  )

  const [carregandoMetricas, setCarregandoMetricas] = useState(true)
  const [reflexao, setReflexao] = useState<ReflexaoDiaria | null>(null)
  const [carregandoReflexao, setCarregandoReflexao] = useState(true)

  const carregarMetricas = useCallback(async () => {
    try {
      setCarregandoMetricas(true)

      const dados = await buscarResumoMetricas()

      setResumoMetricas(dados)
    } catch (erro: any) {
      if (erro?.response?.status === 404) {
        setResumoMetricas(null)
        return
      }

      console.error('Erro ao carregar métricas:', erro)
    } finally {
      setCarregandoMetricas(false)
    }
  }, [])
  useEffect(() => {
    carregarMetricas()
  }, [carregarMetricas])

  useEffect(() => {
    async function carregarReflexao() {
      try {
        const dados = await buscarReflexaoDeHoje()
        setReflexao(dados)
      } catch {
        setReflexao(null)
      } finally {
        setCarregandoReflexao(false)
      }
    }

    carregarReflexao()
  }, [])

  return (
    <View style={styles.container}>
      <Pressable onPress={logout} style={styles.botaoSair}>
        <Text style={styles.textoBotao}>Sair</Text>
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}>
        <View style={styles.cabecalho}>
          <Text style={styles.titulo}>
            Olá, {usuario?.first_name || usuario?.username}
          </Text>

          <Text style={styles.subtitulo}>O que você deseja fazer hoje?</Text>
        </View>

        <MetricasCard
          resumo={resumoMetricas}
          carregando={carregandoMetricas}
          aoAtualizar={carregarMetricas}
        />

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

  tituloSecao: {
    fontSize: 16,
    fontWeight: '800',
    color: '#242424',
    marginBottom: 12,
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
