import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'

import { router } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'

import {
  buscarHistoricoMetricas,
  buscarPeriodosMetricas,
  buscarResumoGeralMetricas,
  HistoricoConsumo,
  PeriodoMetrica,
  ResumoGeralMetricas,
} from '../../servicos/metricas'
import { MaterialCommunityIcons } from '@expo/vector-icons'

/*
|--------------------------------------------------------------------------
| FORMATADORES
|--------------------------------------------------------------------------
*/

function formatarMoeda(valor: string | number) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-')

  return `${dia}/${mes}/${ano}`
}

function formatarDataCurta(data: string) {
  const [, mes, dia] = data.split('-')

  return `${dia}/${mes}`
}

function formatarDataISO(data: Date) {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

function formatarPeriodo(inicio: string, fim: string) {
  return `${formatarData(inicio)} → ${formatarData(fim)}`
}

function voltar() {
  if (router.canGoBack()) {
    router.back()
    return
  }

  router.replace('/inicio')
}

/*
|--------------------------------------------------------------------------
| DATA
|--------------------------------------------------------------------------
*/

function criarDatasEntre(inicio: string, fim: string) {
  const datas: string[] = []

  const [anoInicio, mesInicio, diaInicio] = inicio.split('-').map(Number)

  const [anoFim, mesFim, diaFim] = fim.split('-').map(Number)

  const dataInicio = new Date(anoInicio, mesInicio - 1, diaInicio)

  const dataFim = new Date(anoFim, mesFim - 1, diaFim)

  const dataAtual = new Date(dataInicio)

  while (dataAtual <= dataFim) {
    datas.push(formatarDataISO(dataAtual))

    dataAtual.setDate(dataAtual.getDate() + 1)
  }

  return datas
}

/*
|--------------------------------------------------------------------------
| GRÁFICO DE BARRAS
|--------------------------------------------------------------------------
*/

function GraficoBarras({
  periodos,
  largura,
  selecionado,
  onSelecionar,
}: {
  periodos: PeriodoMetrica[]
  largura: number
  selecionado: number | null
  onSelecionar: (index: number | null) => void
}) {
  if (periodos.length === 0) {
    return (
      <View style={styles.graficoVazio}>
        <Text style={styles.vazio}>
          Ainda não existem períodos para exibir.
        </Text>
      </View>
    )
  }

  const alturaMaxima = 140

  const maiorValor = Math.max(
    ...periodos.map((item) => Number(item.economizado)),
    1,
  )

  return (
    <View style={[styles.graficoCard, { width: largura }]}>
      <View style={styles.graficoCabecalho}>
        <View>
          <Text style={styles.graficoTitulo}>Economia</Text>

          <Text style={styles.graficoDescricao}>
            Economia acumulada por período
          </Text>
        </View>
      </View>

      <View style={[styles.areaBarras, { width: largura - 32 }]}>
        <View style={[styles.linhaReferencia, { top: 0 }]} />

        <View style={[styles.linhaReferencia, { top: 70 }]} />

        <View style={[styles.linhaReferencia, { top: 140 }]} />

        <View style={styles.barras}>
          {periodos.map((item, index) => {
            const valor = Number(item.economizado)

            const altura = (valor / maiorValor) * alturaMaxima

            const ativo = selecionado === index

            return (
              <Pressable
                key={item.id ?? `${item.data_inicio}-${item.data_fim}`}
                onPress={() => onSelecionar(ativo ? null : index)}
                style={styles.colunaBarra}>
                <Text
                  style={[styles.valorBarra, ativo && styles.valorBarraAtivo]}>
                  {formatarMoeda(item.economizado)}
                </Text>

                <View
                  style={[
                    styles.barra,
                    {
                      height: Math.max(altura, 8),
                    },
                    item.atual && styles.barraAtual,
                    ativo && styles.barraSelecionada,
                  ]}
                />
              </Pressable>
            )
          })}
        </View>
      </View>

      <View style={styles.labelsBarras}>
        {periodos.map((item) => (
          <View
            key={item.id ?? `${item.data_inicio}-${item.data_fim}-label`}
            style={styles.labelBarra}>
            <Text style={styles.labelDataInicio}>
              {formatarDataCurta(item.data_inicio)}
            </Text>

            <Text style={styles.labelDataFim}>
              {formatarDataCurta(item.data_fim)}
            </Text>

            {item.atual && <Text style={styles.labelAtual}>Atual</Text>}
          </View>
        ))}
      </View>
    </View>
  )
}

/*
|--------------------------------------------------------------------------
| GRÁFICO DE LINHA
|--------------------------------------------------------------------------
|
| Aqui não usamos "períodos" como pontos.
|
| Exemplo:
|
| 01/08
| 02/08
| 03/08
| 04/08
| ...
| 02/10
|
| Cada dia vira um ponto.
|
*/

function GraficoLinha({
  periodo,
  largura,
  dataAtual,
}: {
  periodo: PeriodoMetrica | null
  largura: number
  dataAtual: string
}) {
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null)

  const dados = useMemo(() => {
    if (!periodo) {
      return []
    }

    const fim = dataAtual

    const datas = criarDatasEntre(periodo.data_inicio, fim)

    const gastoDiario = Number(periodo.gasto_medio_diario)

    return datas.map((data, index) => ({
      data,
      dia: index + 1,
      economizado: gastoDiario * (index + 1),
    }))
  }, [periodo, dataAtual])

  if (!periodo || dados.length === 0) {
    return (
      <View style={[styles.graficoCard, { width: largura }]}>
        <Text style={styles.graficoTitulo}>Evolução diária</Text>

        <View style={styles.graficoVazio}>
          <Text style={styles.vazio}>
            Ainda não existem dados para montar o gráfico.
          </Text>
        </View>
      </View>
    )
  }

  const alturaGrafico = 180
  const larguraInterna = largura - 32

  const maiorValor = Math.max(...dados.map((item) => item.economizado), 1)

  /*
   * Transformamos cada dia em uma posição
   * dentro do gráfico.
   */

  const pontos = dados.map((item, index) => {
    const x =
      dados.length === 1
        ? larguraInterna / 2
        : (index / (dados.length - 1)) * (larguraInterna - 12)

    const y =
      alturaGrafico -
      20 -
      (item.economizado / maiorValor) * (alturaGrafico - 40)

    return {
      ...item,
      x,
      y: Math.max(8, Math.min(alturaGrafico - 8, y)),
    }
  })

  const primeiroPonto = pontos[0]

  const ultimoPonto = pontos[pontos.length - 1]

  /*
   * Escolhemos alguns pontos para os labels.
   */

  const indiceMeio = Math.floor((dados.length - 1) / 2)

  /*
   * Tooltip.
   */

  const pontoSelecionado =
    diaSelecionado !== null ? dados[diaSelecionado] : null

  return (
    <View style={[styles.graficoCard, { width: largura }]}>
      <View style={styles.graficoCabecalho}>
        <View>
          <Text style={styles.graficoTitulo}>Evolução diária</Text>

          <Text style={styles.graficoDescricao}>Do início até hoje</Text>
        </View>

        <View style={styles.badgeHoje}>
          <Text style={styles.badgeHojeTexto}>{dados.length} dias</Text>
        </View>
      </View>

      {/* GRÁFICO */}

      <View
        style={[
          styles.areaLinha,
          {
            width: larguraInterna,
            height: alturaGrafico,
          },
        ]}>
        {/* LINHAS DE REFERÊNCIA */}

        <View style={[styles.linhaReferencia, { top: 0 }]} />

        <View style={[styles.linhaReferencia, { top: alturaGrafico / 2 }]} />

        <View
          style={[
            styles.linhaReferencia,
            {
              top: alturaGrafico - 1,
            },
          ]}
        />

        {/* SEGMENTOS DA LINHA */}

        {pontos.map((ponto, index) => {
          if (index === 0) {
            return null
          }

          const anterior = pontos[index - 1]

          const dx = ponto.x - anterior.x

          const dy = ponto.y - anterior.y

          const comprimento = Math.sqrt(dx * dx + dy * dy)

          const angulo = Math.atan2(dy, dx) * (180 / Math.PI)

          const centroX = (anterior.x + ponto.x) / 2

          const centroY = (anterior.y + ponto.y) / 2

          return (
            <View
              key={`segmento-${index}`}
              style={[
                styles.segmentoLinha,
                {
                  width: comprimento,
                  left: centroX - comprimento / 2,
                  top: centroY - 1.5,
                  transform: [
                    {
                      rotate: `${angulo}deg`,
                    },
                  ],
                },
              ]}
            />
          )
        })}

        {/* PONTOS */}

        {pontos.map((ponto, index) => {
          const ativo = diaSelecionado === index

          /*
           * Para muitos dias, mostramos
           * visualmente apenas alguns pontos.
           *
           * Mas todos continuam clicáveis.
           */

          const mostrarPonto =
            dados.length <= 20 ||
            index === 0 ||
            index === dados.length - 1 ||
            index % 7 === 0

          if (!mostrarPonto) {
            return (
              <Pressable
                key={`area-${index}`}
                onPress={() => setDiaSelecionado(ativo ? null : index)}
                style={{
                  position: 'absolute',
                  left: ponto.x - 8,
                  top: ponto.y - 8,
                  width: 16,
                  height: 16,
                }}
              />
            )
          }

          return (
            <Pressable
              key={`ponto-${index}`}
              onPress={() => setDiaSelecionado(ativo ? null : index)}
              style={[
                styles.pontoLinha,
                {
                  left: ponto.x - 5,
                  top: ponto.y - 5,
                },
                ativo && styles.pontoSelecionado,
              ]}
            />
          )
        })}
      </View>

      {/* EIXO X */}

      <View style={[styles.eixoDatas, { width: larguraInterna }]}>
        <View style={styles.dataEixo}>
          <Text style={styles.dataEixoPrincipal}>
            {formatarDataCurta(primeiroPonto.data)}
          </Text>

          <Text style={styles.dataEixoSecundaria}>Início</Text>
        </View>

        {dados.length > 2 && (
          <View style={[styles.dataEixo, styles.dataEixoCentro]}>
            <Text style={styles.dataEixoPrincipal}>
              {formatarDataCurta(dados[indiceMeio].data)}
            </Text>
          </View>
        )}

        <View style={styles.dataEixo}>
          <Text style={styles.dataEixoPrincipal}>
            {formatarDataCurta(ultimoPonto.data)}
          </Text>

          <Text style={[styles.dataEixoSecundaria, styles.dataAtualTexto]}>
            Hoje
          </Text>
        </View>
      </View>

      {/* TOOLTIP */}

      {pontoSelecionado && (
        <View style={styles.tooltip}>
          <View style={styles.tooltipCabecalho}>
            <Text style={styles.tooltipTitulo}>
              {formatarData(pontoSelecionado.data)}
            </Text>

            <View style={styles.badgeDia}>
              <Text style={styles.badgeDiaTexto}>
                Dia {pontoSelecionado.dia}
              </Text>
            </View>
          </View>

          <View style={styles.tooltipLinha}>
            <Text style={styles.tooltipLabel}>Dias sem consumo</Text>

            <Text style={styles.tooltipValor}>{pontoSelecionado.dia}</Text>
          </View>

          <View style={styles.tooltipLinha}>
            <Text style={styles.tooltipLabel}>Média diária</Text>

            <Text style={styles.tooltipValor}>
              {formatarMoeda(periodo.gasto_medio_diario)}
            </Text>
          </View>

          <View style={styles.tooltipLinha}>
            <Text style={styles.tooltipLabel}>Economia acumulada</Text>

            <Text style={styles.tooltipEconomizado}>
              {formatarMoeda(pontoSelecionado.economizado)}
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}

/*
|--------------------------------------------------------------------------
| TELA
|--------------------------------------------------------------------------
*/

export default function ResumoMetricasScreen() {
  const { width: larguraTela } = useWindowDimensions()

  const [resumo, setResumo] = useState<ResumoGeralMetricas | null>(null)

  const [historico, setHistorico] = useState<HistoricoConsumo[]>([])

  const [periodos, setPeriodos] = useState<PeriodoMetrica[]>([])

  const [carregando, setCarregando] = useState(true)

  /*
   * Data atual.
   *
   * Essa variável é usada para montar
   * o gráfico diário.
   */

  const dataAtual = formatarDataISO(new Date())

  /*
   * Largura real disponível para os cards.
   *
   * Antes os gráficos tinham width: 320,
   * por isso dois cards acabavam saindo
   * da tela.
   */

  const larguraGrafico = Math.max(larguraTela - 72, 280)

  useEffect(() => {
    async function carregar() {
      try {
        const [dadosResumo, dadosHistorico, dadosPeriodos] = await Promise.all([
          buscarResumoGeralMetricas(),
          buscarHistoricoMetricas(),
          buscarPeriodosMetricas(),
        ])

        setResumo(dadosResumo)
        setHistorico(dadosHistorico)
        setPeriodos(dadosPeriodos)
      } catch (erro) {
        console.error('Erro ao carregar resumo das métricas:', erro)
      } finally {
        setCarregando(false)
      }
    }

    carregar()
  }, [])

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator color="#7C6BC4" />
      </View>
    )
  }

  /*
   * Encontramos o período atual.
   */

  const periodoAtual =
    periodos.find((item) => item.atual) ?? periodos[periodos.length - 1] ?? null

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}>
        {/* CABEÇALHO */}

        <View style={styles.cabecalho}>
          <Pressable style={styles.botaoVoltar} onPress={voltar}>
            <Text style={styles.textoVoltar}>‹</Text>
          </Pressable>

          <View style={styles.cabecalhoTexto}>
            <Text style={styles.titulo}>
              <MaterialCommunityIcons
                name="chart-bar"
                size={40}
                marginHorizontal={8}
                color="#e0b0d4ff"
              />
              Seu resumo
            </Text>

            <Text style={styles.subtitulo}>
              Acompanhe sua evolução ao longo do tempo.
            </Text>
          </View>
        </View>

        {/* RESUMO GERAL */}

        {resumo && (
          <>
            <View style={styles.grade}>
              <View style={styles.card}>
                <Text style={styles.label}>Dias sem consumo</Text>

                <Text style={styles.numero}>{resumo.dias_total}</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.label}>Total economizado</Text>

                <Text style={styles.valor}>
                  {formatarMoeda(resumo.economizado_total)}
                </Text>
              </View>
            </View>

            <View style={styles.grade}>
              <View style={styles.card}>
                <Text style={styles.label}>Média por dia</Text>

                <Text style={styles.valor}>
                  {formatarMoeda(resumo.media_economizada_diaria)}
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.label}>Ciclos</Text>

                <Text style={styles.numero}>{resumo.total_ciclos}</Text>
              </View>
            </View>
          </>
        )}

        {/* GRÁFICOS */}

        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Economia por período</Text>

          <Text style={styles.subtituloGrafico}>
            Compare seus ciclos de economia.
          </Text>

          <GraficoBarras
            periodos={periodos}
            largura={larguraGrafico}
            selecionado={null}
            onSelecionar={() => {}}
          />
        </View>

        {/* EVOLUÇÃO DIÁRIA */}

        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Histórico da evolução</Text>

          <Text style={styles.subtituloGrafico}>
            Evolução diária desde o início do ciclo atual até hoje.
          </Text>

          <GraficoLinha
            periodo={periodoAtual}
            largura={larguraGrafico}
            dataAtual={dataAtual}
          />
        </View>

        {/* HISTÓRICO DE CICLOS */}

        <View style={styles.secao}>
          <Text style={styles.tituloSecao}>Histórico</Text>

          {historico.length === 0 && (
            <View style={styles.cardHistorico}>
              <Text style={styles.vazio}>
                Seu histórico aparecerá aqui quando você recomeçar um ciclo.
              </Text>
            </View>
          )}

          {historico.map((item) => (
            <View key={item.id} style={styles.cardHistorico}>
              <View style={styles.historicoCabecalho}>
                <Text style={styles.periodo}>
                  {formatarPeriodo(item.data_inicio, item.data_fim)}
                </Text>

                <Text style={styles.economizado}>
                  {formatarMoeda(item.economizado)}
                </Text>
              </View>

              <View style={styles.historicoRodape}>
                <Text style={styles.historicoInfo}>
                  {item.dias_sem_consumo} dias
                </Text>

                <Text style={styles.historicoInfo}>
                  {formatarMoeda(item.gasto_medio_diario)}
                  /dia
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

/*
|--------------------------------------------------------------------------
| STYLES
|--------------------------------------------------------------------------
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#F7F4FC',
  },

  carregando: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#F7F4FC',
  },

  conteudo: {
    padding: 20,

    paddingTop: 28,

    paddingBottom: 40,
  },

  /*
  |--------------------------------------------------------------------------
  | CABEÇALHO
  |--------------------------------------------------------------------------
  */

  cabecalho: {
    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 22,
  },

  botaoVoltar: {
    width: 38,
    height: 38,

    borderRadius: 12,

    backgroundColor: '#EEEAF9',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  textoVoltar: {
    fontSize: 28,

    lineHeight: 30,

    color: '#7C6BC4',
  },

  cabecalhoTexto: {
    flex: 1,
  },

  titulo: {
    fontSize: 26,

    fontWeight: '800',

    color: '#242424',
  },

  subtitulo: {
    fontSize: 13,

    color: '#777',

    marginTop: 3,
  },

  /*
  |--------------------------------------------------------------------------
  | RESUMO
  |--------------------------------------------------------------------------
  */

  grade: {
    flexDirection: 'row',

    gap: 12,

    marginBottom: 12,
  },

  card: {
    flex: 1,

    minHeight: 100,

    backgroundColor: '#FFFFFF',

    borderRadius: 16,

    padding: 16,

    justifyContent: 'center',
  },

  label: {
    fontSize: 11,

    color: '#999',

    marginBottom: 5,
  },

  numero: {
    fontSize: 28,

    fontWeight: '800',

    color: '#7C6BC4',
  },

  valor: {
    fontSize: 17,

    fontWeight: '800',

    color: '#242424',
  },

  /*
  |--------------------------------------------------------------------------
  | SEÇÕES
  |--------------------------------------------------------------------------
  */

  secao: {
    marginTop: 20,
  },

  tituloSecao: {
    fontSize: 18,

    fontWeight: '800',

    color: '#242424',

    marginBottom: 5,
  },

  subtituloGrafico: {
    fontSize: 11,

    color: '#999',

    marginBottom: 10,
  },

  /*
  |--------------------------------------------------------------------------
  | CARD DO GRÁFICO
  |--------------------------------------------------------------------------
  */

  graficoCard: {
    backgroundColor: '#FFFFFF',

    borderRadius: 18,

    padding: 16,

    overflow: 'hidden',
  },

  graficoCabecalho: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 18,
  },

  graficoTitulo: {
    fontSize: 15,

    fontWeight: '800',

    color: '#242424',
  },

  graficoDescricao: {
    fontSize: 10,

    color: '#999',

    marginTop: 3,
  },

  /*
  |--------------------------------------------------------------------------
  | BARRAS
  |--------------------------------------------------------------------------
  */

  areaBarras: {
    height: 155,

    position: 'relative',

    justifyContent: 'flex-end',
  },

  barras: {
    height: 140,

    flexDirection: 'row',

    alignItems: 'flex-end',

    justifyContent: 'space-around',

    gap: 10,
  },

  colunaBarra: {
    flex: 1,

    height: 155,

    alignItems: 'center',

    justifyContent: 'flex-end',
  },

  valorBarra: {
    fontSize: 9,

    color: '#888',

    fontWeight: '700',

    marginBottom: 4,
  },

  valorBarraAtivo: {
    color: '#7C6BC4',
  },

  barra: {
    width: 34,

    borderRadius: 9,

    backgroundColor: '#C9C0EA',
  },

  barraAtual: {
    backgroundColor: '#9A8BD8',
  },

  barraSelecionada: {
    backgroundColor: '#7C6BC4',
  },

  labelsBarras: {
    flexDirection: 'row',

    gap: 10,

    marginTop: 9,
  },

  labelBarra: {
    flex: 1,

    alignItems: 'center',
  },

  labelDataInicio: {
    fontSize: 9,

    fontWeight: '700',

    color: '#555',
  },

  labelDataFim: {
    fontSize: 9,

    color: '#999',

    marginTop: 2,
  },

  labelAtual: {
    fontSize: 8,

    fontWeight: '800',

    color: '#7C6BC4',

    marginTop: 3,
  },

  /*
  |--------------------------------------------------------------------------
  | LINHAS DE REFERÊNCIA
  |--------------------------------------------------------------------------
  */

  linhaReferencia: {
    position: 'absolute',

    left: 0,
    right: 0,

    height: 1,

    backgroundColor: '#EEEAF5',
  },

  /*
  |--------------------------------------------------------------------------
  | GRÁFICO DE LINHA
  |--------------------------------------------------------------------------
  */

  areaLinha: {
    position: 'relative',

    justifyContent: 'center',
  },

  segmentoLinha: {
    position: 'absolute',

    height: 3,

    backgroundColor: '#7C6BC4',

    borderRadius: 3,
  },

  pontoLinha: {
    position: 'absolute',

    width: 10,
    height: 10,

    borderRadius: 5,

    backgroundColor: '#FFFFFF',

    borderWidth: 3,

    borderColor: '#7C6BC4',
  },

  pontoSelecionado: {
    width: 14,
    height: 14,

    borderRadius: 7,

    backgroundColor: '#7C6BC4',

    borderColor: '#FFFFFF',
  },

  /*
  |--------------------------------------------------------------------------
  | EIXO DE DATAS
  |--------------------------------------------------------------------------
  */

  eixoDatas: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    marginTop: 8,
  },

  dataEixo: {
    alignItems: 'center',
  },

  dataEixoCentro: {
    position: 'absolute',

    left: '50%',

    transform: [
      {
        translateX: -18,
      },
    ],
  },

  dataEixoPrincipal: {
    fontSize: 9,

    fontWeight: '700',

    color: '#555',
  },

  dataEixoSecundaria: {
    fontSize: 8,

    color: '#999',

    marginTop: 2,
  },

  dataAtualTexto: {
    color: '#7C6BC4',

    fontWeight: '800',
  },

  badgeHoje: {
    backgroundColor: '#EEEAF9',

    borderRadius: 8,

    paddingHorizontal: 8,

    paddingVertical: 5,
  },

  badgeHojeTexto: {
    fontSize: 9,

    fontWeight: '800',

    color: '#7C6BC4',
  },

  /*
  |--------------------------------------------------------------------------
  | TOOLTIP
  |--------------------------------------------------------------------------
  */

  tooltip: {
    marginTop: 14,

    backgroundColor: '#FAF9FD',

    borderRadius: 14,

    padding: 13,

    borderWidth: 1,

    borderColor: '#EEEAF9',
  },

  tooltipCabecalho: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 8,
  },

  tooltipTitulo: {
    fontSize: 12,

    fontWeight: '800',

    color: '#242424',
  },

  badgeDia: {
    backgroundColor: '#EEEAF9',

    borderRadius: 7,

    paddingHorizontal: 7,

    paddingVertical: 4,
  },

  badgeDiaTexto: {
    fontSize: 8,

    fontWeight: '800',

    color: '#7C6BC4',
  },

  tooltipLinha: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginTop: 6,
  },

  tooltipLabel: {
    fontSize: 11,

    color: '#999',
  },

  tooltipValor: {
    fontSize: 11,

    fontWeight: '700',

    color: '#444',
  },

  tooltipEconomizado: {
    fontSize: 13,

    fontWeight: '800',

    color: '#7C6BC4',
  },

  /*
  |--------------------------------------------------------------------------
  | VAZIO
  |--------------------------------------------------------------------------
  */

  graficoVazio: {
    minHeight: 120,

    justifyContent: 'center',

    alignItems: 'center',
  },

  vazio: {
    textAlign: 'center',

    color: '#999',

    fontSize: 11,
  },

  /*
  |--------------------------------------------------------------------------
  | HISTÓRICO
  |--------------------------------------------------------------------------
  */

  cardHistorico: {
    backgroundColor: '#FFFFFF',

    borderRadius: 16,

    padding: 15,

    marginBottom: 10,
  },

  historicoCabecalho: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  periodo: {
    fontSize: 12,

    fontWeight: '700',

    color: '#444',
  },

  economizado: {
    fontSize: 14,

    fontWeight: '800',

    color: '#7C6BC4',
  },

  historicoRodape: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    marginTop: 8,
  },

  historicoInfo: {
    fontSize: 11,

    color: '#999',
  },
})
