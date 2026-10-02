import { useState } from 'react'

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import { MotiText, MotiView } from 'moti'
import { router } from 'expo-router'
import { useAuth } from '../../contextos/AuthContext'
import { cores } from '../../estilos/cores'

export default function LoginScreen() {
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)

  async function handleLogin() {
    if (!username.trim() || !password) {
      Alert.alert('Atenção', 'Informe usuário e senha.')

      return
    }

    try {
      setCarregando(true)

      await login(username.trim(), password)
    } catch (erro: any) {
      console.log('Erro no login:', erro?.response?.data ?? erro)

      Alert.alert('Não foi possível entrar', 'Usuário ou senha inválidos.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <LinearGradient
      colors={[cores.rosaClaro, '#F7F4FC', cores.azulClaro]}
      locations={[0, 0.48, 1]}
      style={styles.container}>
      <KeyboardAvoidingView
        style={styles.teclado}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.conteudo}>
          {/* Logo / título */}

          <MotiView
            from={{
              opacity: 0,
              scale: 0.75,
              translateY: -30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              translateY: 0,
            }}
            transition={{
              type: 'spring',
              duration: 900,
            }}
            style={styles.cabecalho}>
            <View style={styles.logo}>
              <Text style={styles.logoTexto}>CR</Text>
            </View>

            <MotiText
              from={{
                opacity: 0,
                translateY: -15,
              }}
              animate={{
                opacity: 1,
                translateY: 0,
              }}
              transition={{
                delay: 250,
              }}
              style={styles.titulo}>
              Colcha de Retalhos
            </MotiText>

            <MotiText
              from={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 450,
              }}
              style={styles.subtitulo}>
              Um espaço para compartilhar, acolher e caminhar juntos.
            </MotiText>
          </MotiView>

          {/* Formulário */}

          <MotiView
            from={{
              opacity: 0,
              translateY: 40,
            }}
            animate={{
              opacity: 1,
              translateY: 0,
            }}
            transition={{
              delay: 500,
              type: 'timing',
              duration: 700,
            }}
            style={styles.cartao}>
            <Text style={styles.tituloFormulario}>Bem-vindo</Text>

            <Text style={styles.textoFormulario}>Entre para continuar</Text>

            {/* Usuário */}

            <View style={styles.grupo}>
              <Text style={styles.label}>Usuário</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.icone}>@</Text>

                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Digite seu usuário"
                  placeholderTextColor={cores.textoSecundario}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!carregando}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Senha */}

            <View style={styles.grupo}>
              <Text style={styles.label}>Senha</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.icone}>•</Text>

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Digite sua senha"
                  placeholderTextColor={cores.textoSecundario}
                  secureTextEntry={!mostrarSenha}
                  autoCapitalize="none"
                  editable={!carregando}
                  style={styles.input}
                />

                <Pressable onPress={() => setMostrarSenha((valor) => !valor)}>
                  <Text style={styles.mostrarSenha}>
                    {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Botão */}

            <MotiView
              from={{
                scale: 0.96,
              }}
              animate={{
                scale: carregando ? 0.98 : 1,
              }}
              transition={{
                type: 'timing',
                duration: 150,
              }}>
              <Pressable
                onPress={handleLogin}
                disabled={carregando}
                style={[styles.botao, carregando && styles.botaoDesabilitado]}>
                {carregando ? (
                  <View style={styles.carregando}>
                    <ActivityIndicator color={cores.branco} />

                    <Text style={styles.textoBotao}>Entrando...</Text>
                  </View>
                ) : (
                  <Text style={styles.textoBotao}>Entrar</Text>
                )}
              </Pressable>
              <Pressable
                onPress={() => router.push('/cadastro')}
                style={styles.botaoCadastro}>
                <Text style={styles.textoCadastro}>
                  Não possui uma conta?{' '}
                  <Text style={styles.destaqueCadastro}>Criar cadastro</Text>
                </Text>
              </Pressable>
            </MotiView>
          </MotiView>

          {/* Rodapé */}

          <MotiText
            from={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 1000,
            }}
            style={styles.rodape}>
            Colcha de Retalhos © 2026
          </MotiText>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  teclado: {
    flex: 1,
  },

  conteudo: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  cabecalho: {
    alignItems: 'center',
    marginBottom: 28,
  },

  logo: {
    width: 76,
    height: 76,
    borderRadius: 38,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(255,255,255,0.72)',

    borderWidth: 1,
    borderColor: cores.borda,

    marginBottom: 16,
  },

  logoTexto: {
    fontSize: 26,
    fontWeight: '800',
    color: cores.preto,
  },

  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: cores.preto,
    textAlign: 'center',
  },

  subtitulo: {
    fontSize: 14,
    color: cores.textoSecundario,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    maxWidth: 300,
  },

  cartao: {
    backgroundColor: 'rgba(255,255,255,0.78)',

    borderRadius: 26,

    padding: 24,

    borderWidth: 1,
    borderColor: cores.borda,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.08,
    shadowRadius: 25,

    elevation: 6,
  },

  tituloFormulario: {
    fontSize: 22,
    fontWeight: '800',
    color: cores.preto,
  },

  textoFormulario: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginTop: 4,
    marginBottom: 22,
  },

  grupo: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: cores.preto,
    marginBottom: 7,
  },

  inputContainer: {
    height: 54,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: cores.fundoInput,

    borderRadius: 14,

    borderWidth: 1,
    borderColor: cores.borda,

    paddingHorizontal: 14,
  },

  icone: {
    width: 28,
    fontSize: 20,
    fontWeight: '700',
    color: cores.textoSecundario,
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: cores.preto,
  },

  mostrarSenha: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7770B8',
  },

  botao: {
    height: 54,

    borderRadius: 15,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#7C6BC4',

    marginTop: 6,
  },

  botaoDesabilitado: {
    opacity: 0.65,
  },
  botaoCadastro: {
    height: 50,
    borderRadius: 15,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(255,255,255,0.55)',

    borderWidth: 1,
    borderColor: '#7C6BC4',

    marginTop: 12,
  },

  textoCadastro: {
    color: cores.textoSecundario,
    fontSize: 14,
    fontWeight: '600',
  },

  destaqueCadastro: {
    color: '#7C6BC4',
    fontWeight: '800',
  },

  carregando: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  textoBotao: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: '800',
  },

  rodape: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 11,
    color: cores.textoSecundario,
  },
})
