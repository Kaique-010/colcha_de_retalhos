import { Pressable, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'

interface ModuloScreenProps {
  titulo: string
  descricao: string
}

export default function ModuloScreen({ titulo, descricao }: ModuloScreenProps) {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.botaoVoltar}>
        <Text style={styles.textoVoltar}>← Voltar</Text>
      </Pressable>

      <View style={styles.conteudo}>
        <Text style={styles.titulo}>{titulo}</Text>

        <Text style={styles.descricao}>{descricao}</Text>

        <Text style={styles.emBreve}>Módulo em construção</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4FC',
  },

  botaoVoltar: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 10,

    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,

    backgroundColor: '#ffe4f8ff',
  },

  textoVoltar: {
    color: '#7C6BC4',
    fontSize: 15,
    fontWeight: '700',
  },

  conteudo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#242424',
  },

  descricao: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
  },

  emBreve: {
    marginTop: 24,
    fontSize: 14,
    fontWeight: '700',
    color: '#7C6BC4',
  },
})
