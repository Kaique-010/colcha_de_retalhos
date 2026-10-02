React Native
│
│ JWT / HTTPS
▼
Django REST Framework
│
├── Autenticação
├── Usuários
├── Grupos
├── Reuniões
├── Presenças
├── Eventos
├── Avisos
└── Conteúdos
│
▼
PostgreSQL

front - Com axios para as requisiçoes

src/
├── api/
├── componentes/
├── contextos/
├── hooks/
├── navegacao/
├── telas/
│ ├── autenticacao/
│ └── inicio/
├── servicos/
├── armazenamento/
└── tipos/


Blueprint estrutura do projeto

                    User
                     │
                   Perfil
                     │
          ┌──────────┼──────────┐
          │          │          │
       Reuniões    Estudos    Métricas
          │
   ┌──────┴──────┐
   │             │
TipoReuniao  Programacao
                     
ReflexaoDiaria
      │
      └── integração AARJ

