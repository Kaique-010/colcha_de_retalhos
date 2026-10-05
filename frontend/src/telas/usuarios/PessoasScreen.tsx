import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  buscarMeuPerfil,
  buscarUsuarios,
  Usuario,
} from '../../servicos/usuarios'

import { useAuth } from '../../contextos/AuthContext'
import { useToast } from '../../contextos/ToastContext'

export default function PessoasScreen() {
  const { usuario } = useAuth()
  const { mostrarToast } = useToast()

  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [perfil, setPerfil] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarPessoas()
  }, [])

  async function carregarPessoas() {
    try {
      if (usuario?.is_staff) {
        const dados = await buscarUsuarios()
        setUsuarios(dados)
      } else {
        const dados = await buscarMeuPerfil()
        setPerfil(dados)
      }
    } catch (error) {
      console.error('ERRO AO CARREGAR PESSOAS:', error)

      mostrarToast(
        'Não foi possível carregar as pessoas.',
        'erro',
      )
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

  if (!usuario?.is_staff && perfil) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Meu perfil</Text>

        <View style={styles.card}>
          <Text style={styles.nome}>
            {perfil.first_name} {perfil.last_name}
          </Text>

          <Text style={styles.campo}>
            Usuário: {perfil.username}
          </Text>

          <Text style={styles.campo}>
            E-mail: {perfil.email}
          </Text>

          <Text style={styles.campo}>
            Telefone: {perfil.perfil?.telefone || 'Não informado'}
          </Text>

          <Text
            style={[
              styles.status,
              perfil.perfil?.ativo
                ? styles.statusAtivo
                : styles.statusInativo,
            ]}>
            {perfil.perfil?.ativo ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pessoas</Text>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>
              {item.first_name} {item.last_name}
            </Text>

            <Text style={styles.campo}>
              Usuário: {item.username}
            </Text>

            <Text style={styles.campo}>
              E-mail: {item.email}
            </Text>

            <Text style={styles.campo}>
              Telefone: {item.perfil?.telefone || 'Não informado'}
            </Text>

            <View style={styles.rodape}>
              <Text
                style={[
                  styles.status,
                  item.perfil?.ativo
                    ? styles.statusAtivo
                    : styles.statusInativo,
                ]}>
                {item.perfil?.ativo ? 'Ativo' : 'Inativo'}
              </Text>

              {item.is_staff && (
                <Text style={styles.admin}>
                  Administrador
                </Text>
              )}
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F7F4FC',
  },

  centralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F4FC',
  },

  titulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#222',
    marginBottom: 20,
  },

  lista: {
    gap: 12,
    paddingBottom: 24,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  nome: {
    fontSize: 18,
    fontWeight: '800',
    color: '#222',
    marginBottom: 12,
  },

  campo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },

  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },

  status: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '700',
  },

  statusAtivo: {
    color: '#3F8A5B',
    backgroundColor: '#E8F6ED',
  },

  statusInativo: {
    color: '#A64B4B',
    backgroundColor: '#FBEAEA',
  },

  admin: {
    color: '#7C6BC4',
    backgroundColor: '#EEEAF9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '700',
  },
})