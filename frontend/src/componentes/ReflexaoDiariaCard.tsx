import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, StyleSheet, Text, View } from 'react-native'

interface ReflexaoDiaria {
  id: number
  data: string
  titulo: string
  conteudo: string
  fonte: string
}

interface Props {
  reflexao: ReflexaoDiaria
}

export default function ReflexaoDiariaCard({ reflexao }: Props) {
  const deslocamento = useRef(new Animated.Value(0)).current

  const [larguraTexto, setLarguraTexto] = useState(0)
  const [larguraArea, setLarguraArea] = useState(0)

  useEffect(() => {
    if (!larguraTexto || !larguraArea) {
      return
    }

    deslocamento.stopAnimation()
    deslocamento.setValue(larguraArea)

    const distancia = larguraTexto + 40

    const animacao = Animated.loop(
      Animated.sequence([
        Animated.timing(deslocamento, {
          toValue: -distancia,
          duration: Math.max(distancia * 35, 10000),
          easing: Easing.linear,
          useNativeDriver: true,
        }),

        Animated.timing(deslocamento, {
          toValue: larguraArea,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    )

    animacao.start()

    return () => {
      animacao.stop()
    }
  }, [larguraTexto, larguraArea])

  return (
    <View style={styles.card}>
      <Text style={styles.rotulo}>REFLEXÃO DO DIA</Text>

      <Text style={styles.titulo}>{reflexao.titulo}</Text>

      <Text style={styles.data}>{reflexao.data}</Text>

      <View
        style={styles.areaTexto}
        onLayout={(evento) => {
          setLarguraArea(evento.nativeEvent.layout.width)
        }}>
        <Animated.View
          style={[
            styles.faixa,
            {
              transform: [
                {
                  translateX: deslocamento,
                },
              ],
            },
          ]}>
          <Text
            style={styles.conteudo}
            onLayout={(evento) => {
              setLarguraTexto(evento.nativeEvent.layout.width)
            }}>
            {reflexao.conteudo}
          </Text>

          <Text style={styles.separador}>{'     •     '}</Text>

          <Text style={styles.conteudo}>{reflexao.conteudo}</Text>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    width: 450,
    minHeight: 130,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',

    elevation: 3,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  rotulo: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C6BC4',
    marginBottom: 10,
  },

  titulo: {
    fontSize: 14,
    fontWeight: '800',
    color: '#242424',
  },

  data: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
    marginBottom: 16,
  },

  areaTexto: {
    width: '100%',
    height: 30,
    overflow: 'hidden',
  },

  faixa: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  conteudo: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 23,
    color: '#555',

    // impede o texto de quebrar em várias linhas
    flexShrink: 0,
    includeFontPadding: false,
  },

  separador: {
    fontSize: 15,
    lineHeight: 23,
    color: '#7C6BC4',
    includeFontPadding: false,
  },
})
