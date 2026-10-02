import { useState } from 'react'
import { router } from 'expo-router'

import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import {
  configurarMetricas,
  recomecarMetricas,
  ResumoMetricas,
} from '../../servicos/metricas'

interface MetricasCardProps {
  resumo: ResumoMetricas | null
  carregando: boolean
  aoAtualizar: () => Promise<void>
}

function formatarMoeda(valor: string) {
  const numero = Number(valor)

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-')

  return `${dia}/${mes}/${ano}`
}

export function MetricasCard({
  resumo,
  carregando,
  aoAtualizar,
}: MetricasCardProps) {
  const [dataInicio, setDataInicio] = useState('')
  const [gastoMedio, setGastoMedio] = useState('')

  const [salvando, setSalvando] = useState(false)
  const [modalRecomecar, setModalRecomecar] = useState(false)

  async function salvarConfiguracao() {
    if (!dataInicio || !gastoMedio) {
      return
    }

    try {
      setSalvando(true)

      await configurarMetricas({
        data_inicio: dataInicio,
        gasto_medio_diario: gastoMedio,
      })

      await aoAtualizar()

      setDataInicio('')
      setGastoMedio('')
    } finally {
      setSalvando(false)
    }
  }

  async function confirmarRecomeco() {
    try {
      setSalvando(true)

      await recomecarMetricas()

      setModalRecomecar(false)

      await aoAtualizar()
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <View style={styles.cardCarregando}>
        <ActivityIndicator color="#7C6BC4" />
      </View>
    )
  }

  /*
   * PRIMEIRO ACESSO
   */

  if (!resumo) {
    return (
      <View style={styles.card}>
        <View style={styles.cabecalho}>
          <View style={styles.icone}>
            <Text style={styles.iconeTexto}>✓</Text>
          </View>

          <View style={styles.cabecalhoTexto}>
            <Text style={styles.titulo}>Comece seu acompanhamento</Text>

            <Text style={styles.descricao}>
              Registre seu início e acompanhe seu progresso diariamente.
            </Text>
          </View>
        </View>

        <View style={styles.formulario}>
          <View>
            <Text style={styles.label}>Data de início</Text>

            <TextInput
              value={dataInicio}
              onChangeText={setDataInicio}
              placeholder="AAAA-MM-DD"
              placeholderTextColor="#AAA"
              style={styles.input}
              keyboardType="numbers-and-punctuation"
            />
          </View>

          <View>
            <Text style={styles.label}>Gasto médio por dia</Text>

            <TextInput
              value={gastoMedio}
              onChangeText={setGastoMedio}
              placeholder="Ex.: 30,00"
              placeholderTextColor="#AAA"
              style={styles.input}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <Pressable
          style={styles.botaoPrincipal}
          onPress={salvarConfiguracao}
          disabled={salvando}>
          {salvando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.textoBotaoPrincipal}>
              Começar acompanhamento
            </Text>
          )}
        </Pressable>
      </View>
    )
  }

  /*
   * ACOMPANHAMENTO ATIVO
   */

  return (
    <>
      <View style={styles.card}>
        {/* CABEÇALHO */}

        <View style={styles.cabecalho}>
          <View style={styles.icone}>
            <Text style={styles.iconeTexto}>✓</Text>
          </View>

          <View style={styles.cabecalhoTexto}>
            <Text style={styles.titulo}>Seu progresso</Text>

            <Text style={styles.descricao}>
              Continue acompanhando sua evolução.
            </Text>
          </View>
        </View>

        {/* DESTAQUE */}

        <View style={styles.destaque}>
          <Text style={styles.numero}>{resumo.dias_sem_consumo}</Text>

          <Text style={styles.unidade}>dias sem consumo</Text>
        </View>

        {/* INFORMAÇÕES */}

        <View style={styles.informacoes}>
          <View style={styles.informacao}>
            <Text style={styles.label}>Economizado</Text>

            <Text style={styles.valor}>
              {formatarMoeda(resumo.economizado)}
            </Text>
          </View>

          <View style={styles.divisor} />

          <View style={styles.informacao}>
            <Text style={styles.label}>Média diária</Text>

            <Text style={styles.valor}>
              {formatarMoeda(resumo.gasto_medio_diario)}
            </Text>
          </View>
        </View>

        {/* RODAPÉ */}

        <View style={styles.rodape}>
          <Text style={styles.data}>
            Início em {formatarData(resumo.data_inicio)}
          </Text>

          <View style={styles.acoes}>
            <Pressable
              onPress={() => router.push('/metricas')}
              style={styles.botaoResumo}>
              <Text style={styles.textoResumo}>Ver resumo</Text>
            </Pressable>

            <Pressable
              onPress={() => setModalRecomecar(true)}
              style={styles.botaoRecomecar}>
              <Text style={styles.textoRecomecar}>Recomeçar</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* MODAL DE RECOMEÇO */}

      <Modal
        visible={modalRecomecar}
        transparent
        animationType="fade"
        onRequestClose={() => setModalRecomecar(false)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalIcone}>
              <Text style={styles.modalIconeTexto}>↻</Text>
            </View>

            <Text style={styles.modalTitulo}>Recomeçar acompanhamento?</Text>

            <Text style={styles.modalTexto}>
              Seu contador será reiniciado a partir de hoje. Seu progresso atual
              será encerrado.
            </Text>

            <View style={styles.modalBotoes}>
              <Pressable
                style={styles.botaoCancelar}
                onPress={() => setModalRecomecar(false)}
                disabled={salvando}>
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.botaoConfirmar}
                onPress={confirmarRecomeco}
                disabled={salvando}>
                {salvando ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.textoConfirmar}>Recomeçar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  /*
   * CARD
   */

  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    marginBottom: 28,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 2,
  },

  cardCarregando: {
    width: '100%',
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 28,
  },

  /*
   * CABEÇALHO
   */

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icone: {
    width: 44,
    height: 44,
    borderRadius: 14,

    backgroundColor: '#EEEAF9',

    justifyContent: 'center',
    alignItems: 'center',
  },

  iconeTexto: {
    color: '#7C6BC4',
    fontSize: 20,
    fontWeight: '800',
  },

  cabecalhoTexto: {
    flex: 1,
    marginLeft: 12,
  },

  titulo: {
    fontSize: 19,
    fontWeight: '800',
    color: '#242424',
  },

  descricao: {
    fontSize: 13,
    lineHeight: 19,
    color: '#777',
    marginTop: 3,
  },

  /*
   * DESTAQUE
   */

  destaque: {
    alignItems: 'center',

    marginTop: 24,
    marginBottom: 22,

    paddingVertical: 18,

    borderRadius: 16,

    backgroundColor: '#F7F4FC',
  },

  numero: {
    fontSize: 30,
    fontWeight: '800',
    color: '#7C6BC4',
  },

  unidade: {
    fontSize: 10,
    color: '#777',
    marginTop: 2,
  },

  /*
   * INFORMAÇÕES
   */

  informacoes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  informacao: {
    flex: 1,
  },

  divisor: {
    width: 1,
    height: 42,

    backgroundColor: '#E8E5EF',

    marginHorizontal: 16,
  },

  label: {
    fontSize: 10,
    color: '#999',
    marginBottom: 4,
  },

  valor: {
    fontSize: 17,
    fontWeight: '800',
    color: '#242424',
  },

  /*
   * RODAPÉ
   */

  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingTop: 16,

    borderTopWidth: 1,
    borderTopColor: '#F0EDF4',
  },

  data: {
    flex: 1,
    fontSize: 12,
    color: '#999',
  },

  acoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  botaoResumo: {
    paddingHorizontal: 12,
    paddingVertical: 8,

    borderRadius: 10,

    backgroundColor: '#EEEAF9',
  },

  textoResumo: {
    color: '#7C6BC4',
    fontSize: 12,
    fontWeight: '700',
  },

  botaoRecomecar: {
    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 10,

    backgroundColor: '#F0ECFA',
  },

  textoRecomecar: {
    color: '#7C6BC4',
    fontSize: 12,
    fontWeight: '700',
  },

  /*
   * FORMULÁRIO
   */

  formulario: {
    gap: 14,
    marginTop: 22,
  },

  input: {
    backgroundColor: '#F7F4FC',

    borderWidth: 1,
    borderColor: '#E8E3F0',

    borderRadius: 12,

    paddingHorizontal: 14,
    paddingVertical: 12,

    fontSize: 15,
    color: '#242424',

    marginTop: 6,
  },

  /*
   * BOTÃO PRINCIPAL
   */

  botaoPrincipal: {
    backgroundColor: '#7C6BC4',

    borderRadius: 12,

    paddingVertical: 14,

    alignItems: 'center',

    marginTop: 18,
  },

  textoBotaoPrincipal: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /*
   * MODAL
   */

  overlay: {
    flex: 1,

    backgroundColor: 'rgba(36, 36, 36, 0.45)',

    justifyContent: 'center',
    alignItems: 'center',

    padding: 24,
  },

  modal: {
    width: '100%',

    backgroundColor: '#FFFFFF',

    borderRadius: 22,

    padding: 24,
  },

  modalIcone: {
    width: 46,
    height: 46,

    borderRadius: 14,

    backgroundColor: '#EEEAF9',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 16,
  },

  modalIconeTexto: {
    color: '#7C6BC4',
    fontSize: 24,
    fontWeight: '700',
  },

  modalTitulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#242424',

    marginBottom: 8,
  },

  modalTexto: {
    fontSize: 14,
    lineHeight: 21,
    color: '#777',

    marginBottom: 24,
  },

  modalBotoes: {
    flexDirection: 'row',
    gap: 10,
  },

  botaoCancelar: {
    flex: 1,

    borderWidth: 1,
    borderColor: '#E1DEE8',

    borderRadius: 11,

    paddingVertical: 13,

    alignItems: 'center',
  },

  textoCancelar: {
    color: '#555',
    fontSize: 14,
    fontWeight: '600',
  },

  botaoConfirmar: {
    flex: 1,

    backgroundColor: '#7C6BC4',

    borderRadius: 11,

    paddingVertical: 13,

    alignItems: 'center',
  },

  textoConfirmar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
})
