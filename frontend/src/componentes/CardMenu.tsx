import { Pressable, StyleSheet, Text, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

type IconeNome = keyof typeof MaterialCommunityIcons.glyphMap

interface CardMenuProps {
  titulo: string
  descricao: string
  icone: IconeNome
  onPress: () => void
}

export default function CardMenu({
  titulo,
  descricao,
  icone,
  onPress,
}: CardMenuProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressionado]}>
      <View style={styles.iconeContainer}>
        <MaterialCommunityIcons name={icone} size={28} color="#7C6BC4" />
      </View>

      <Text style={styles.titulo}>{titulo}</Text>

      <Text style={styles.descricao}>{descricao}</Text>

      <Text style={styles.acessar}>Acessar →</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  cardPressionado: {
    transform: [{ scale: 0.97 }],
  },

  iconeContainer: {
    width: 52,
    height: 52,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0EBFF',
    marginBottom: 18,
  },

  titulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#242424',
  },

  descricao: {
    fontSize: 13,
    color: '#777',
    marginTop: 6,
    lineHeight: 18,
  },

  acessar: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C6BC4',
    marginTop: 'auto',
  },
})
