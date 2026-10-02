import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useEffect, useState } from 'react'
import { router } from 'expo-router'

import {
  buscarCalendario,
  DiaReuniao,
} from '../../servicos/reunioes'

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-')

  return `${dia}/${mes}`
}

function formatarDiaSemana(data: string) {
  const [ano, mes, dia] = data.split('-')

  const dataLocal = new Date(
    Number(ano),
    Number(mes) - 1,
    Number(dia),
  )

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
  }).format(dataLocal)
}

function obterInicioSemana() {
  const hoje = new Date()

  const dia = hoje.getDay()

  const diferenca = dia === 0 ? -6 : 1 - dia

  const inicio = new Date(hoje)

  inicio.setDate(hoje.getDate() + diferenca)

  return inicio
}

function formatarDataApi(data: Date) {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

export default function ReunioesScreen() {
  const [dias, setDias] = useState<DiaReuniao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    async function carregarCalendario() {
      try {
        setCarregando(true)
        setErro(false)

        const inicio = obterInicioSemana()

        const fim = new Date(inicio)

        fim.setDate(inicio.getDate() + 6)

        const dados = await buscarCalendario(
          formatarDataApi(inicio),
          formatarDataApi(fim),
        )

        setDias(dados)
      } catch (error) {
        console.error(
          'Erro ao carregar calendário:',
          error,
        )

        setErro(true)
      } finally {
        setCarregando(false)
      }
    }

    carregarCalendario()
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <View style={styles.cabecalho}>
          <Pressable
            onPress={() => router.back()}
            style={styles.botaoVoltar}
          >
            <Text style={styles.textoVoltar}>
              ← Voltar
            </Text>
          </Pressable>

          <Text style={styles.titulo}>
            Reuniões
          </Text>

          <Text style={styles.subtitulo}>
            Confira as reuniões programadas
          </Text>
        </View>

        {carregando && (
          <View style={styles.estado}>
            <ActivityIndicator size="large" />

            <Text style={styles.textoEstado}>
              Carregando reuniões...
            </Text>
          </View>
        )}

        {!carregando && erro && (
          <View style={styles.estado}>
            <Text style={styles.textoErro}>
              Não foi possível carregar as reuniões.
            </Text>
          </View>
        )}

        {!carregando && !erro && dias.length === 0 && (
          <View style={styles.estado}>
            <Text style={styles.textoEstado}>
              Nenhuma reunião programada.
            </Text>
          </View>
        )}

        {!carregando &&
          !erro &&
          dias.map((dia) => (
            <View
              key={dia.data}
              style={styles.dia}
            >
              <View style={styles.cabecalhoDia}>
                <Text style={styles.nomeDia}>
                  {formatarDiaSemana(dia.data)}
                </Text>

                <Text style={styles.data}>
                  {formatarData(dia.data)}
                </Text>
              </View>

              {dia.programacoes.length === 0 && (
                <Text style={styles.semReuniao}>
                  Nenhuma reunião neste dia.
                </Text>
              )}

              {dia.programacoes.map(
                (programacao, index) => (
                  <View
                    key={`${dia.data}-${index}`}
                    style={styles.card}
                  >
                    <Text style={styles.nomeReuniao}>
                      {programacao.tipo_reuniao.nome}
                    </Text>

                    <Text style={styles.horario}>
                      {programacao.hora_inicio} -{' '}
                      {programacao.hora_fim}
                    </Text>

                    {programacao.tipo_reuniao
                      .descricao && (
                      <Text style={styles.descricao}>
                        {
                          programacao.tipo_reuniao
                            .descricao
                        }
                      </Text>
                    )}

                    <View style={styles.detalhes}>
                      <Text style={styles.detalhe}>
                        {programacao.modalidade}
                      </Text>

                      {programacao.local && (
                        <Text style={styles.detalhe}>
                          {programacao.local}
                        </Text>
                      )}
                    </View>

                    {programacao.link && (
                      <Pressable
                        style={styles.botaoLink}
                        onPress={() => {
                          // Vamos implementar a abertura
                          // do link na próxima etapa.
                        }}
                      >
                        <Text style={styles.textoLink}>
                          Acessar reunião →
                        </Text>
                      </Pressable>
                    )}
                  </View>
                ),
              )}
            </View>
          ))}
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
    padding: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },

  cabecalho: {
    marginBottom: 30,
  },

  botaoVoltar: {
    marginBottom: 20,
  },

  textoVoltar: {
    color: '#7C6BC4',
    fontSize: 15,
    fontWeight: '700',
  },

  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#242424',
  },

  subtitulo: {
    fontSize: 16,
    color: '#777',
    marginTop: 8,
  },

  estado: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },

  textoEstado: {
    marginTop: 12,
    color: '#777',
    fontSize: 15,
  },

  textoErro: {
    color: '#999',
    fontSize: 15,
  },

  dia: {
    marginBottom: 28,
  },

  cabecalhoDia: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  nomeDia: {
    fontSize: 19,
    fontWeight: '800',
    color: '#242424',
    textTransform: 'capitalize',
  },

  data: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },

  semReuniao: {
    color: '#999',
    fontSize: 14,
    paddingVertical: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,

    elevation: 3,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  nomeReuniao: {
    fontSize: 19,
    fontWeight: '800',
    color: '#242424',
  },

  horario: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '700',
    color: '#7C6BC4',
  },

  descricao: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    color: '#666',
  },

  detalhes: {
    marginTop: 14,
    gap: 6,
  },

  detalhe: {
    fontSize: 13,
    color: '#777',
  },

  botaoLink: {
    alignSelf: 'flex-start',
    marginTop: 16,
  },

  textoLink: {
    color: '#7C6BC4',
    fontSize: 14,
    fontWeight: '800',
  },
})