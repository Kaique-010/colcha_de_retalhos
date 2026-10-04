import { Pressable, StyleSheet, Text, View } from 'react-native'
import { MotiView } from 'moti'

interface ToastProps {
  visivel: boolean
  mensagem: string
  tipo: 'erro' | 'sucesso'
  fechar: () => void
}

export default function Toast({
  visivel,
  mensagem,
  tipo,
  fechar,
}: ToastProps) {
  if (!visivel) {
    return null
  }

  return (
    <MotiView
      from={{
        opacity: 0,
        translateY: -30,
      }}
      animate={{
        opacity: 1,
        translateY: 0,
      }}
      exit={{
        opacity: 0,
        translateY: -30,
      }}
      transition={{
        type: 'timing',
        duration: 250,
      }}
      style={[
        styles.container,
        tipo === 'erro'
          ? styles.erro
          : styles.sucesso,
      ]}
    >
      <View
        style={[
          styles.icone,
          tipo === 'erro'
            ? styles.iconeErro
            : styles.iconeSucesso,
        ]}
      >
        <Text style={styles.iconeTexto}>
          {tipo === 'erro' ? '!' : '✓'}
        </Text>
      </View>

      <View style={styles.conteudo}>
        <Text style={styles.titulo}>
          {tipo === 'erro'
            ? 'Não foi possível realizar a ação'
            : 'Sucesso'}
        </Text>

        <Text style={styles.mensagem}>
          {mensagem}
        </Text>
      </View>

      <Pressable
        onPress={fechar}
        style={styles.fechar}
      >
        <Text style={styles.fecharTexto}>
          ×
        </Text>
      </Pressable>
    </MotiView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',

    top: 24,
    left: 24,
    right: 24,

    zIndex: 9999,

    minHeight: 72,

    borderRadius: 16,

    paddingHorizontal: 14,
    paddingVertical: 12,

    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 15,

    elevation: 10,
  },

  erro: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#F3B5B5',
  },

  sucesso: {
    backgroundColor: '#F1FFF7',
    borderWidth: 1,
    borderColor: '#A8D8BD',
  },

  icone: {
    width: 38,
    height: 38,

    borderRadius: 19,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },

  iconeErro: {
    backgroundColor: '#D92D20',
  },

  iconeSucesso: {
    backgroundColor: '#12B76A',
  },

  iconeTexto: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },

  conteudo: {
    flex: 1,
  },

  titulo: {
    fontSize: 14,
    fontWeight: '800',
    color: '#242424',
    marginBottom: 3,
  },

  mensagem: {
    fontSize: 13,
    color: '#777',
    lineHeight: 18,
  },

  fechar: {
    width: 30,
    height: 30,

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 8,
  },

  fecharTexto: {
    fontSize: 24,
    color: '#777',
  },
})