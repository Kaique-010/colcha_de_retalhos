import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'

import { Estudo, buscarEstudo } from '../../servicos/estudos'
import { useToast } from '../../contextos/ToastContext'
import { router } from 'expo-router'

export default function EstudoDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const [estudo, setEstudo] = useState<Estudo | null>(null)
  const [carregando, setCarregando] = useState(true)
  const { mostrarToast } = useToast()

  useEffect(() => {
    carregarEstudo()
  }, [id])

  async function carregarEstudo() {
    try {
      const dados = await buscarEstudo(Number(id))

      console.log('ESTUDO:', dados)
      mostrarToast('Estudo carregado com sucesso.', 'sucesso')
      setEstudo(dados)
    } catch (error) {
      console.error('ERRO AO BUSCAR ESTUDO:', error)
      mostrarToast('Erro ao carregar estudo.', 'erro')
    } finally {
      setCarregando(false)
    }
  }

  if (carregando) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!estudo) {
    return (
      <View style={styles.centralizado}>
        <Text>Estudo não encontrado.</Text>
      </View>
    )
  }

  function voltar() {
    router.back()
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}>
      <Pressable style={styles.botaoVoltar} onPress={voltar}>
        <Text style={styles.textoVoltar}>‹ Voltar</Text>
      </Pressable>
      <Text style={styles.titulo}>{estudo.titulo}</Text>

      <Text style={styles.descricao}>{estudo.descricao}</Text>

      <View style={styles.divisor} />

      <Text style={styles.texto}>{estudo.conteudo}</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },

  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titulo: {
    marginTop: 50,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },

  descricao: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666666',
  },

  divisor: {
    height: 1,
    backgroundColor: '#E8E5F0',
    marginVertical: 22,
  },

  texto: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 27,
    color: '#333333',
  },
  botaoVoltar: {
    position: 'absolute',
    top: 20,
    left: 20,
    borderRadius: 12,
    padding: 8,
    backgroundColor: '#e4dffcff',
  },
  textoVoltar: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7C6BC4',
  },
})
