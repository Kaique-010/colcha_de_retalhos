import { useState } from 'react'

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { MotiText, MotiView } from 'moti'
import { router } from 'expo-router'

import { fazerCadastro } from '../../servicos/autenticacao'
import { cores } from '../../estilos/cores'

type IconeNome = keyof typeof MaterialCommunityIcons.glyphMap

export default function CadastroScreen() {
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmacao, setPasswordConfirmacao] = useState('')

  const [carregando, setCarregando] = useState(false)

  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)

  async function handleCadastro() {
    if (
      !username.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password ||
      !passwordConfirmacao
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.')

      return
    }

    if (password !== passwordConfirmacao) {
      Alert.alert('Atenção', 'As senhas não coincidem.')

      return
    }

    try {
      setCarregando(true)

      await fazerCadastro({
        username: username.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        password,
        password_confirmacao: passwordConfirmacao,
      })

      Alert.alert('Cadastro realizado', 'Sua conta foi criada com sucesso.', [
        {
          text: 'Continuar',
          onPress: () => router.replace('/login'),
        },
      ])
    } catch (erro: any) {
      console.log('Erro no cadastro:', erro?.response?.data ?? erro)

      const dados = erro?.response?.data

      if (dados?.username?.[0]) {
        Alert.alert('Cadastro', dados.username[0])
        return
      }

      if (dados?.email?.[0]) {
        Alert.alert('Cadastro', dados.email[0])
        return
      }

      if (dados?.password_confirmacao?.[0]) {
        Alert.alert('Cadastro', dados.password_confirmacao[0])
        return
      }

      Alert.alert(
        'Não foi possível cadastrar',
        'Verifique os dados informados e tente novamente.',
      )
    } finally {
      setCarregando(false)
    }
  }

  function Campo({
    icone,
    label,
    placeholder,
    value,
    onChangeText,
    ...props
  }: {
    icone: IconeNome
    label: string
    placeholder: string
    value: string
    onChangeText: (valor: string) => void
    [key: string]: any
  }) {
    return (
      <View style={styles.grupo}>
        <Text style={styles.label}>{label}</Text>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name={icone}
            size={20}
            color={cores.textoSecundario}
            style={styles.icone}
          />

          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={cores.textoSecundario}
            editable={!carregando}
            style={styles.input}
            {...props}
          />
        </View>
      </View>
    )
  }

  return (
    <LinearGradient
      colors={[cores.rosaClaro, '#F7F4FC', cores.azulClaro]}
      locations={[0, 0.48, 1]}
      style={styles.container}>
      <KeyboardAvoidingView
        style={styles.teclado}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}>
          <View style={styles.conteudo}>
            {/* Cabeçalho */}

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
                Criar sua conta
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
                Faça seu cadastro para começar.
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
              <Text style={styles.tituloFormulario}>Seus dados</Text>

              <Text style={styles.textoFormulario}>
                Informe seus dados para criar sua conta.
              </Text>

              <View style={styles.linha}>
                <View style={styles.metade}>
                  <Campo
                    icone="account-outline"
                    label="Nome"
                    placeholder="Seu nome"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>

                <View style={styles.metade}>
                  <Campo
                    icone="account-outline"
                    label="Sobrenome"
                    placeholder="Seu sobrenome"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>

              <Campo
                icone="account-circle-outline"
                label="Usuário"
                placeholder="Digite seu usuário"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Campo
                icone="email-outline"
                label="E-mail"
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Campo
                icone="phone-outline"
                label="Telefone"
                placeholder="Seu telefone"
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
              />

              {/* Senha */}

              <View style={styles.grupo}>
                <Text style={styles.label}>Senha</Text>

                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={20}
                    color={cores.textoSecundario}
                    style={styles.icone}
                  />

                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Crie uma senha"
                    placeholderTextColor={cores.textoSecundario}
                    secureTextEntry={!mostrarSenha}
                    autoCapitalize="none"
                    editable={!carregando}
                    style={styles.input}
                  />

                  <Pressable onPress={() => setMostrarSenha((valor) => !valor)}>
                    <MaterialCommunityIcons
                      name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                      size={21}
                      color="#7770B8"
                    />
                  </Pressable>
                </View>
              </View>

              {/* Confirmação */}

              <View style={styles.grupo}>
                <Text style={styles.label}>Confirmar senha</Text>

                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons
                    name="lock-check-outline"
                    size={20}
                    color={cores.textoSecundario}
                    style={styles.icone}
                  />

                  <TextInput
                    value={passwordConfirmacao}
                    onChangeText={setPasswordConfirmacao}
                    placeholder="Digite a senha novamente"
                    placeholderTextColor={cores.textoSecundario}
                    secureTextEntry={!mostrarConfirmacao}
                    autoCapitalize="none"
                    editable={!carregando}
                    style={styles.input}
                  />

                  <Pressable
                    onPress={() => setMostrarConfirmacao((valor) => !valor)}>
                    <MaterialCommunityIcons
                      name={
                        mostrarConfirmacao ? 'eye-off-outline' : 'eye-outline'
                      }
                      size={21}
                      color="#7770B8"
                    />
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
                  onPress={handleCadastro}
                  disabled={carregando}
                  style={[
                    styles.botao,
                    carregando && styles.botaoDesabilitado,
                  ]}>
                  {carregando ? (
                    <View style={styles.carregando}>
                      <ActivityIndicator color={cores.branco} />

                      <Text style={styles.textoBotao}>Criando conta...</Text>
                    </View>
                  ) : (
                    <Text style={styles.textoBotao}>Criar conta</Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => router.replace('/login')}
                  style={styles.botaoVoltar}>
                  <Text style={styles.textoVoltar}>
                    Já possui uma conta?{' '}
                    <Text style={styles.destaqueVoltar}>Entrar</Text>
                  </Text>
                </Pressable>
              </MotiView>
            </MotiView>

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
              Colcha de Retalhos
            </MotiText>
          </View>
        </ScrollView>
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

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  conteudo: {
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
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

  linha: {
    flexDirection: 'row',
    gap: 12,
  },

  metade: {
    flex: 1,
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
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: cores.preto,
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

  textoBotao: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: '800',
  },

  carregando: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  botaoVoltar: {
    height: 48,

    borderRadius: 15,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(255,255,255,0.5)',

    borderWidth: 1,
    borderColor: '#7C6BC4',

    marginTop: 12,
  },

  textoVoltar: {
    color: cores.textoSecundario,
    fontSize: 14,
    fontWeight: '600',
  },

  destaqueVoltar: {
    color: '#7C6BC4',
    fontWeight: '800',
  },

  rodape: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 11,
    color: cores.textoSecundario,
  },
})
