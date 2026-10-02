# Colcha de Retalhos

Aplicação mobile para gerenciamento e acompanhamento de uma comunidade, desenvolvida com React Native no frontend e Django REST Framework no backend.

O projeto foi estruturado com uma API REST, autenticação JWT, PostgreSQL, Redis e Celery, utilizando Docker para padronizar o ambiente de desenvolvimento.

---

## Arquitetura

```text
                         COLCHA DE RETALHOS

┌─────────────────────────────────────────────────────────┐
│                    React Native                         │
│                                                         │
│  Telas • Contextos • Hooks • Serviços • Componentes    │
│                                                         │
│                    Axios                                │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ JWT / HTTP(S)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                 Django REST Framework                   │
│                                                         │
│  ├── Autenticação                                       │
│  ├── Usuários                                           │
│  ├── Grupos                                             │
│  ├── Reuniões                                           │
│  ├── Presenças                                          │
│  ├── Eventos                                            │
│  ├── Avisos                                             │
│  ├── Conteúdos                                          │
│  ├── Reflexão Diária                                    │
│  └── Métricas                                           │
│                                                         │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ PostgreSQL  │
                  └─────────────┘

                  ┌─────────────┐
                  │    Redis    │
                  └──────┬──────┘
                         │
                         ▼
                  ┌─────────────┐
                  │   Celery    │
                  │   + Beat    │
                  └─────────────┘

Stack
Backend
- Python
- Django
- Django REST Framework
- Simple JWT
- PostgreSQL
- Celery
- Redis
- drf-spectacular / Swagger
- Docker
Frontend
- React Native
- Expo
- Expo Router
- TypeScript
- Axios
- Context API
Infraestrutura
- Docker
- Docker Compose
- PostgreSQL 17
- Redis 7
Arquitetura do domínio
A estrutura principal do sistema segue o seguinte relacionamento:
                         User
                          │
                       Perfil
                          │
          ┌───────────────┼────────────────┐
          │               │                │
      Reuniões         Estudos          Métricas
          │
     ┌────┴───────────────┐
     │                    │
TipoReuniao          Programacao
                             

Além dos módulos principais:
ReflexaoDiaria
      │
      └── Integração AARJ

Funcionalidades
Autenticação
- Login com JWT
- Access Token
- Refresh Token
- Logout com blacklist do token
- Proteção das APIs
- Cadastro de usuários
- Perfil do usuário
Usuários
- Cadastro
- Perfil
- Controle de usuário ativo
- Informações adicionais do usuário
Reuniões
- Tipos de reunião
- Programação das reuniões
- Calendário
- Horários
- Modalidade
- Local
- Link da reunião
Reflexão Diária
- Reflexão diária
- Data
- Título
- Conteúdo
- Fonte
- Integração com AARJ
- Importação automática
- Atualização automática utilizando Celery Beat
Métricas
- Controle de consumo
- Dias sem consumo
- Gasto médio diário
- Economia acumulada
- Histórico de ciclos
- Resumo geral
- Evolução diária
- Gráficos de evolução
Estudos
Estrutura preparada para conteúdos e categorias de estudos.
Estrutura do projeto
colcha_de_retalhos/
│
├── core/
│   ├── __init__.py
│   ├── asgi.py
│   ├── celery.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── Dockerfile
│
├── usuarios/
│   ├── migrations/
│   ├── services/
│   ├── admin.py
│   ├── apps.py
│   ├── cadastro_views.py
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   ├── views.py
│   └── tests.py
│
├── reunioes/
│   ├── migrations/
│   ├── services/
│   │   └── calendario.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
│
├── reflexoes/
│   ├── migrations/
│   ├── services/
│   │   ├── importar.py
│   │   ├── reflexao.py
│   │   └── scraping.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── tasks.py
│   ├── urls.py
│   └── views.py
│
├── metricas/
│   ├── migrations/
│   ├── services/
│   │   └── metricas.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
│
├── frontend/
│   │
│   ├── app/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── componentes/
│   │   ├── contextos/
│   │   ├── hooks/
│   │   ├── navegacao/
│   │   ├── telas/
│   │   │   ├── autenticacao/
│   │   │   └── inicio/
│   │   ├── servicos/
│   │   ├── armazenamento/
│   │   └── tipos/
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── .dockerignore
├── .gitignore
├── docker-compose.yml
├── manage.py
├── requirements.txt
└── README.md

Frontend
O frontend utiliza React Native com Expo e TypeScript.
A comunicação com o backend é feita através do Axios.
React Native
      │
      ▼
    Axios
      │
      ▼
Django REST API

Estrutura do frontend
src/
│
├── api/
│   └── cliente.ts
│
├── componentes/
│
├── contextos/
│
├── hooks/
│
├── navegacao/
│
├── telas/
│   ├── autenticacao/
│   └── inicio/
│
├── servicos/
│
├── armazenamento/
│
└── tipos/

api/
Responsável pela configuração do Axios e comunicação com a API.
Exemplo:
src/api/cliente.ts

O cliente HTTP adiciona automaticamente o JWT nas requisições autenticadas.
contextos/
Responsável pelos estados globais da aplicação.
Exemplo:
AuthContext

hooks/
Hooks reutilizáveis da aplicação.
telas/
Contém as telas da aplicação.
telas/
├── autenticacao/
└── inicio/

servicos/
Centraliza as chamadas específicas para a API.
Exemplos:
servicos/
├── metricas.ts
├── reflexoes.ts
└── reunioes.ts

armazenamento/
Responsável pelo armazenamento local de informações necessárias ao aplicativo.
tipos/
Tipos TypeScript compartilhados entre as partes do frontend.
Backend
O backend utiliza Django REST Framework seguindo uma separação entre:
Models
   │
   ▼
Services
   │
   ▼
Serializers
   │
   ▼
Views / ViewSets
   │
   ▼
URLs

A regra de negócio fica concentrada principalmente nos Services, evitando colocar lógica complexa diretamente nas Views.
Banco de dados
O projeto utiliza PostgreSQL.
Django
   │
   ▼
PostgreSQL

No ambiente Docker, o banco é executado através do serviço:
postgres

Banco padrão:
colchaderetalhos

Redis e Celery
O Redis é utilizado como broker para o Celery.
Django
   │
   ▼
 Redis
   │
   ▼
 Celery Worker

O Celery Beat é utilizado para tarefas programadas.
Exemplo:
Celery Beat
     │
     │ todos os dias às 08:00
     ▼
atualizar_reflexao_diaria
     │
     ▼
Scraping AARJ
     │
     ▼
PostgreSQL

Docker
O projeto possui os seguintes serviços:
┌─────────────────────────────┐
│          Docker             │
│                             │
│  ┌───────────────────────┐  │
│  │       backend         │  │
│  │      Django API       │  │
│  │       :8000           │  │
│  └───────────┬───────────┘  │
│              │              │
│  ┌───────────▼───────────┐  │
│  │      PostgreSQL       │  │
│  │        :5432          │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │        Redis          │  │
│  │        :6379          │  │
│  └───────────┬───────────┘  │
│              │              │
│  ┌───────────▼───────────┐  │
│  │        Celery         │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │     Celery Beat       │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘

Requisitos
Para executar o projeto é necessário ter instalado:
- Git
- Docker
- Docker Compose
- Node.js
- npm
Para desenvolvimento mobile com Expo:
- Expo CLI / Expo Go
- Android Studio, caso utilize emulador Android
Configuração
Clone o projeto:
git clone git@github-kaique:Kaique-010/colcha_de_retalhos.git

Entre na pasta:
cd colchaderetalhos

Variáveis de ambiente
Crie um arquivo:
.env

Exemplo:
DEBUG=True

SECRET_KEY=sua-chave-secreta

POSTGRES_DB=colchaderetalhos
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
CELERY_TIMEZONE=America/Sao_Paulo
CELERY_ENABLE_UTC=False

O arquivo .env não deve ser versionado.
Executando com Docker
Na raiz do projeto:
docker compose up -d --build

Verifique os containers:
docker compose ps

A aplicação deverá estar disponível em:
http://localhost:8000

Migrações
Execute:
docker compose exec backend python manage.py migrate

Criando superusuário
docker compose exec backend python manage.py createsuperuser

Depois acesse:
http://localhost:8000/admin/

Logs
Backend:
docker compose logs -f backend

Celery:
docker compose logs -f celery

Celery Beat:
docker compose logs -f celery-beat

PostgreSQL:
docker compose logs -f postgres

Redis:
docker compose logs -f redis

Executando o frontend
Entre na pasta:
cd frontend

Instale as dependências:
npm install

Execute o Expo:
npx expo start

Para executar na web:
npx expo start --web

Para Android:
npx expo start --android

Comunicação Frontend → Backend
O frontend utiliza Axios para consumir a API.
A configuração está em:
frontend/src/api/cliente.ts

Durante o desenvolvimento local:
React Native
      │
      │ Axios
      ▼
http://localhost:8000/api/
      │
      ▼
Django REST Framework

Caso o aplicativo seja executado em um dispositivo físico, o endereço da API deverá apontar para o IP da máquina que está executando o backend.
Exemplo:
http://192.168.0.100:8000/api/

API
A API REST está organizada por módulos.
Exemplos:
/api/usuarios/
/api/reunioes/
/api/reflexoes/
/api/metricas/

Autenticação
Login:
POST /api/usuarios/login/

As demais requisições autenticadas utilizam:
Authorization: Bearer <access_token>

Documentação da API
A documentação da API utiliza OpenAPI através do drf-spectacular.
Swagger:
http://localhost:8000/api/docs/

Schema:
http://localhost:8000/api/schema/

Principais endpoints
Usuários
POST /api/usuarios/login/
GET  /api/usuarios/me/
POST /api/usuarios/cadastro/
POST /api/usuarios/logout/

Reuniões
GET /api/reunioes/
GET /api/reunioes/calendario/

Reflexão diária
GET /api/reflexoes/reflexoes/hoje/
GET /api/reflexoes/reflexoes/por-data/

Métricas
GET  /api/metricas/resumo/
POST /api/metricas/configurar/
POST /api/metricas/recomecar/
GET  /api/metricas/historico/
GET  /api/metricas/resumo-geral/
GET  /api/metricas/periodos/

Estrutura de autenticação
O fluxo de autenticação utiliza JWT:
┌───────────────┐
│ React Native  │
└───────┬───────┘
        │
        │ username + password
        ▼
┌───────────────────┐
│ Django REST API   │
└────────┬──────────┘
         │
         │ access + refresh
         ▼
┌───────────────────┐
│ Armazenamento     │
│ local do app      │
└────────┬──────────┘
         │
         │ Bearer Token
         ▼
┌───────────────────┐
│ APIs protegidas   │
└───────────────────┘

Desenvolvimento
Para subir todo o ambiente:
docker compose up -d

Para acompanhar os logs:
docker compose logs -f

Para parar:
docker compose down

Para reconstruir as imagens:
docker compose up -d --build

docker compose down não remove o volume do PostgreSQL.

Para remover também os volumes:
docker compose down -v

Isso apagará os dados persistidos do PostgreSQL.
Testes
Backend:
docker compose exec backend python manage.py test

Ou, caso esteja utilizando o ambiente Python local:
python manage.py test

Comandos úteis
Abrir o shell do Django:
docker compose exec backend python manage.py shell

Executar migrations:
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate

Criar superusuário:
docker compose exec backend python manage.py createsuperuser

Ver containers:
docker compose ps

Parar ambiente:
docker compose down

Fluxo de desenvolvimento
O desenvolvimento segue uma organização baseada em módulos e separação de responsabilidades.
                    Frontend
                       │
                       ▼
                    Axios
                       │
                       ▼
                     API
                       │
                       ▼
                  View/ViewSet
                       │
                       ▼
                   Serializer
                       │
                       ▼
                    Service
                       │
                       ▼
                     Model
                       │
                       ▼
                  PostgreSQL

Para processos assíncronos:
Service / Task
      │
      ▼
    Redis
      │
      ▼
    Celery
      │
      ▼
PostgreSQL / APIs externas

Blueprint do projeto
                         User
                           │
                         Perfil
                           │
          ┌────────────────┼────────────────┐
          │                │                │
       Reuniões          Estudos          Métricas
          │
     ┌────┴──────┐
     │           │
TipoReuniao   Programacao
                                         
ReflexaoDiaria
      │
      └── Integração AARJ

Objetivo da arquitetura
A aplicação foi estruturada buscando:
- Separação de responsabilidades
- Reutilização de regras de negócio
- APIs independentes do frontend
- Componentização do React Native
- Centralização das chamadas HTTP
- Autenticação baseada em JWT
- Persistência em PostgreSQL
- Processamento assíncrono com Celery
- Agendamento de tarefas com Celery Beat
- Ambiente padronizado através de Docker
- Facilidade de manutenção e evolução dos módulos
Status do projeto
Em desenvolvimento.
Implementado
- [x] Autenticação JWT
- [x] Usuários
- [x] Perfil
- [x] Reuniões
- [x] Calendário de reuniões
- [x] Reflexão diária
- [x] Integração AARJ
- [x] Scraping automático
- [x] Celery
- [x] Celery Beat
- [x] PostgreSQL
- [x] Redis
- [x] Docker
- [x] Métricas
- [x] Histórico de ciclos
- [x] Gráficos de evolução
- [x] Frontend React Native
- [x] Axios
- [x] Expo Router
Em desenvolvimento
- [ ] Estudos
- [ ] Eventos
- [ ] Avisos
- [ ] Presenças
- [ ] Grupos
- [ ] Dashboard
- [ ] Melhorias de UX/UI
- [ ] Testes automatizados
- [ ] Deploy de produção