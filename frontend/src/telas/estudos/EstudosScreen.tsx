import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { router } from 'expo-router'

import { Estudo, buscarEstudos } from '../../servicos/estudos'
import { useToast } from '../../contextos/ToastContext'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function EstudosScreen() {
  const [estudos, setEstudos] = useState<Estudo[]>([])
  const [carregando, setCarregando] = useState(true)
  const { mostrarToast } = useToast()

  useEffect(() => {
    carregarEstudos()
  }, [])

  async function carregarEstudos() {
    try {
      const estudos = await buscarEstudos()

      console.log('ESTUDOS:', estudos)

      setEstudos(estudos)

      mostrarToast('Estudos carregados com sucesso.', 'sucesso')
    } catch (error) {
      console.error('ERRO AO BUSCAR ESTUDOS:', error)

      mostrarToast('Erro ao carregar estudos.', 'erro')
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

  function voltar() {
    router.back()
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.botaoVoltar} onPress={voltar}>
        <Text style={styles.textoVoltar}>‹ Voltar</Text>
      </Pressable>
      <Text style={styles.titulo}>
        <MaterialCommunityIcons
          name="book"
          size={40}
          marginHorizontal={8}
          color="#e0b0d4ff"
        />
        Estudos
      </Text>

      <FlatList
        data={estudos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressionado,
            ]}
            onPress={() =>
              router.push({
                pathname: '/estudos/[id]',
                params: {
                  id: String(item.id),
                },
              })
            }>
            <Text style={styles.cardTitulo}>{item.titulo}</Text>

            <Text style={styles.cardDescricao}>{item.descricao}</Text>

            <Text style={styles.lerMais}>Ler estudo →</Text>
          </Pressable>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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

  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },

  titulo: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: 50,
  },

  lista: {
    gap: 14,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8E5F0',
  },

  cardPressionado: {
    opacity: 0.75,
  },

  cardTitulo: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },

  cardDescricao: {
    fontSize: 14,
    lineHeight: 21,
    color: '#666666',
  },

  lerMais: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: '700',
    color: '#7C6BC4',
  },
})
