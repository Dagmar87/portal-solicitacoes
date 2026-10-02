# Portal de Solicitações Internas

Sistema web para gerenciamento de solicitações internas, desenvolvido como aplicação fullstack com autenticação, CRUD de solicitações, filtros, controle de status e dashboard.

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Requisitos](#requisitos)
- [Configuração do backend](#configuração-do-backend)
- [Configuração do frontend](#configuração-do-frontend)
- [Banco de dados](#banco-de-dados)
- [Executando o projeto](#executando-o-projeto)
- [Executando com Docker](#executando-com-docker)
- [API](#api)
- [Autenticação](#autenticação)
- [Regras de negócio](#regras-de-negócio)
- [Filtros](#filtros)
- [Testes](#testes)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Decisões técnicas](#decisões-técnicas)

## Sobre o projeto

O **Portal de Solicitações Internas** permite que usuários autenticados registrem, consultem e acompanhem solicitações internas de diferentes áreas da organização.

As solicitações possuem:

- Título
- Descrição
- Categoria
- Status
- Usuário responsável pela abertura
- Data de criação
- Data de atualização

As categorias disponíveis são:

- TI
- RH
- Compras
- Financeiro
- Infraestrutura

Os status disponíveis são:

- `ABERTO`
- `EM_ATENDIMENTO`
- `CONCLUIDO`

## Funcionalidades

### Autenticação

- Cadastro de usuário
- Login
- Autenticação baseada em JWT
- Logout
- Proteção das rotas privadas

### Solicitações

- Criar solicitação
- Listar solicitações
- Visualizar detalhes
- Editar solicitação
- Excluir solicitação
- Alterar status
- Associar automaticamente a solicitação ao usuário autenticado

### Filtros

A listagem permite filtrar por:

- Título
- Categoria
- Status
- Data inicial
- Data final

Os filtros podem ser combinados.

### Dashboard

O dashboard apresenta indicadores relacionados às solicitações:

- Total de solicitações
- Solicitações abertas
- Solicitações em atendimento
- Solicitações concluídas

### Interface

- Navegação protegida
- Formulários de criação e edição
- Indicadores visuais de status
- Mensagens de erro
- Estados de carregamento
- Layout responsivo básico

## Tecnologias

### Backend

- Node.js
- Express
- PostgreSQL
- `pg`
- JWT
- bcrypt
- Zod
- Helmet
- CORS
- Jest
- Supertest

### Frontend

- React
- Vite
- React Router
- Axios
- Context API
- CSS

### Infraestrutura

- Docker
- Docker Compose
- PostgreSQL

## Arquitetura

O projeto é dividido em duas aplicações principais:

```text
Frontend (React)
       |
       | HTTP / REST
       v
Backend (Node.js + Express)
       |
       v
PostgreSQL
```

### Backend

O backend utiliza uma separação por responsabilidades:

```text
backend/src/
├── config/
├── controllers/
├── middlewares/
├── repositories/
├── routes/
├── services/
├── utils/
├── validators/
├── app.js
└── server.js
```

Responsabilidades:

- **Routes:** definição dos endpoints.
- **Controllers:** tratamento das requisições HTTP.
- **Services:** regras de negócio.
- **Repositories:** acesso ao banco de dados.
- **Validators:** validação dos dados recebidos.
- **Middlewares:** autenticação, tratamento de erros e segurança.
- **Config:** configurações da aplicação e banco.

### Frontend

```text
frontend/src/
├── components/
├── contexts/
├── pages/
├── services/
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

Responsabilidades:

- **Pages:** telas da aplicação.
- **Components:** componentes reutilizáveis.
- **Contexts:** gerenciamento do estado de autenticação.
- **Services:** comunicação com a API.
- **ProtectedRoute:** proteção das páginas autenticadas.
- **ProtectedLayout:** estrutura compartilhada das páginas privadas.

## Estrutura do projeto

```text
portal-solicitacoes/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── Dockerfile
│
├── database/
│   └── init.sql
│
├── docker-compose.yml
├── README.md
├── MEMORIAL-TECNICO.md
└── .gitignore
```

## Requisitos

Para executar localmente sem Docker:

- Node.js
- npm
- PostgreSQL

Para execução com Docker:

- Docker
- Docker Compose

## Configuração do backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

No Windows, caso o comando `cp` não esteja disponível, copie manualmente o arquivo:

```text
.env.example
```

para:

```text
.env
```

Exemplo de configuração:

```env
NODE_ENV=development
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=portal_solicitacoes
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

JWT_SECRET=portal-solicitacoes-secret-key
JWT_EXPIRES_IN=8h
```

> Em ambiente real, utilize uma chave JWT forte e não versionada no Git.

## Configuração do frontend

Entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

A aplicação frontend utiliza a API:

```text
http://localhost:3000/api
```

O Vite normalmente disponibiliza a aplicação em:

```text
http://localhost:5173
```

## Banco de dados

O projeto utiliza PostgreSQL.

O script de inicialização está em:

```text
database/init.sql
```

O banco possui as principais tabelas:

```text
users
requests
```

### Usuários

Campos principais:

- `id`
- `username`
- `password_hash`
- `created_at`

### Solicitações

Campos principais:

- `id`
- `title`
- `description`
- `category`
- `status`
- `user_id`
- `created_at`
- `updated_at`

Também são utilizados índices para campos relevantes às consultas, incluindo status, categoria, data de criação e usuário.

## Executando o projeto

### 1. Banco de dados

Crie o banco:

```sql
CREATE DATABASE portal_solicitacoes;
```

Execute o script:

```text
database/init.sql
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

O backend ficará disponível em:

```text
http://localhost:3000
```

### 3. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Acesse:

```text
http://localhost:5173
```

## Executando com Docker

O projeto possui configuração para Docker Compose.

Na raiz do projeto:

```bash
docker compose up --build
```

Para executar em segundo plano:

```bash
docker compose up --build -d
```

Para visualizar os logs:

```bash
docker compose logs -f
```

Para parar os containers:

```bash
docker compose down
```

Caso seja necessário remover também os volumes:

```bash
docker compose down -v
```

> Ao utilizar Docker, confira as variáveis de ambiente definidas no `docker-compose.yml` e nos arquivos `.env.example`.

## API

A API possui os seguintes endpoints principais.

### Autenticação

#### Cadastro

```http
POST /api/auth/register
```

Exemplo:

```json
{
  "username": "teste",
  "password": "123456"
}
```

#### Login

```http
POST /api/auth/login
```

Exemplo:

```json
{
  "username": "teste",
  "password": "123456"
}
```

Resposta:

```json
{
  "success": true,
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": 1,
      "username": "teste"
    }
  }
}
```

### Solicitações

#### Listar

```http
GET /api/requests
```

#### Buscar por ID

```http
GET /api/requests/:id
```

#### Criar

```http
POST /api/requests
```

Exemplo:

```json
{
  "title": "Computador não liga",
  "description": "O computador do setor financeiro não está iniciando.",
  "category": "TI"
}
```

#### Atualizar

```http
PUT /api/requests/:id
```

Exemplo:

```json
{
  "title": "Computador não liga - atualizado",
  "description": "O computador continua sem iniciar.",
  "category": "TI"
}
```

#### Alterar status

```http
PATCH /api/requests/:id/status
```

Exemplo:

```json
{
  "status": "EM_ATENDIMENTO"
}
```

#### Excluir

```http
DELETE /api/requests/:id
```

#### Dashboard

```http
GET /api/dashboard
```

## Autenticação

Os endpoints protegidos utilizam JWT.

O token deve ser enviado no header:

```http
Authorization: Bearer SEU_TOKEN
```

No frontend, o Axios adiciona automaticamente o token às requisições autenticadas.

## Regras de negócio

### Criação

Ao criar uma solicitação:

- O status inicial é automaticamente `ABERTO`.
- O usuário autenticado é associado à solicitação.
- A data de criação é registrada automaticamente.

### Edição

Somente solicitações com status:

```text
ABERTO
```

podem ser editadas.

Além disso, o backend valida o usuário associado à solicitação antes de permitir a alteração.

### Exclusão

Somente solicitações com status:

```text
ABERTO
```

podem ser excluídas.

A exclusão também exige que a solicitação pertença ao usuário autenticado.

### Status

Os status permitidos são:

```text
ABERTO
EM_ATENDIMENTO
CONCLUIDO
```

## Filtros

A listagem aceita parâmetros de consulta.

### Por categoria

```http
GET /api/requests?category=TI
```

### Por status

```http
GET /api/requests?status=ABERTO
```

### Por título

```http
GET /api/requests?title=computador
```

### Por período

```http
GET /api/requests?startDate=2026-09-01&endDate=2026-09-30
```

### Combinando filtros

```http
GET /api/requests?category=TI&status=ABERTO&title=computador
```

## Testes manuais da API

Após iniciar o backend, é possível testar o fluxo completo utilizando Postman, Insomnia ou outra ferramenta HTTP.

### 1. Criar usuário

```http
POST /api/auth/register
```

```json
{
  "username": "teste",
  "password": "123456"
}
```

### 2. Fazer login

```http
POST /api/auth/login
```

```json
{
  "username": "teste",
  "password": "123456"
}
```

Copie o token retornado.

### 3. Criar solicitação

```http
POST /api/requests
```

```json
{
  "title": "Computador não liga",
  "description": "O computador do setor financeiro não está iniciando.",
  "category": "TI"
}
```

### 4. Listar solicitações

```http
GET /api/requests
```

### 5. Consultar uma solicitação

```http
GET /api/requests/1
```

### 6. Editar solicitação

Enquanto estiver `ABERTO`:

```http
PUT /api/requests/1
```

### 7. Alterar status

```http
PATCH /api/requests/1/status
```

```json
{
  "status": "EM_ATENDIMENTO"
}
```

Depois:

```json
{
  "status": "CONCLUIDO"
}
```

### 8. Validar regra de edição

Depois que a solicitação deixar de estar `ABERTO`, uma tentativa de edição deverá ser rejeitada pelo backend.

### 9. Validar regra de exclusão

Uma solicitação com status diferente de `ABERTO` também não deverá ser excluída.

### 10. Dashboard

```http
GET /api/dashboard
```

## Testes automatizados

Caso os testes automatizados estejam configurados no backend:

```bash
cd backend
npm test
```

Para executar com cobertura:

```bash
npm test -- --coverage
```

O objetivo dos testes é validar principalmente:

- Autenticação
- Criação de solicitações
- Consulta
- Atualização
- Exclusão
- Alteração de status
- Regras de autorização
- Validação dos dados

## Build do frontend

Para validar a compilação da aplicação:

```bash
cd frontend
npm run build
```

Para executar uma prévia do build:

```bash
npm run preview
```

## Variáveis de ambiente

### Backend

| Variável | Descrição |
|---|---|
| `NODE_ENV` | Ambiente da aplicação |
| `PORT` | Porta do backend |
| `DATABASE_HOST` | Host do PostgreSQL |
| `DATABASE_PORT` | Porta do PostgreSQL |
| `DATABASE_NAME` | Nome do banco |
| `DATABASE_USER` | Usuário do banco |
| `DATABASE_PASSWORD` | Senha do banco |
| `JWT_SECRET` | Chave utilizada para assinatura do JWT |
| `JWT_EXPIRES_IN` | Tempo de expiração do token |

### Segurança

Arquivos `.env` não devem ser versionados.

O `.gitignore` do projeto possui regras para evitar o envio dessas informações ao repositório.

## Decisões técnicas

### Separação de responsabilidades

A aplicação foi organizada para separar responsabilidades entre:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
PostgreSQL
```

Isso facilita manutenção, testes e evolução da aplicação.

### Validação

Os dados recebidos pela API são validados antes do processamento, reduzindo a possibilidade de dados inválidos chegarem às regras de negócio ou ao banco.

### Segurança

Foram consideradas medidas como:

- Hash de senha com bcrypt
- Autenticação JWT
- Rotas protegidas
- Helmet
- CORS
- Validação de entrada
- Variáveis sensíveis em `.env`
- Regras de autorização no backend

### Integridade dos dados

O banco possui:

- Chaves primárias
- Chave estrangeira entre solicitações e usuários
- Restrições para categorias válidas
- Restrições para status válidos
- Índices para consultas frequentes

## Status do projeto

O projeto contempla os principais requisitos funcionais do Portal de Solicitações Internas:

- [x] Autenticação
- [x] Cadastro de usuário
- [x] Login
- [x] Logout
- [x] CRUD de solicitações
- [x] Controle de status
- [x] Filtros
- [x] Dashboard
- [x] Proteção das rotas
- [x] Validação
- [x] Persistência PostgreSQL
- [x] Docker / Docker Compose
- [x] Interface responsiva básica
- [ ] Ampliação da cobertura de testes automatizados

## Autor

**José Dagmar Florentino da Silva Sobrinho**

GitHub: [Dagmar87](https://github.com/Dagmar87)

Projeto: [portal-solicitacoes](https://github.com/Dagmar87/portal-solicitacoes)
