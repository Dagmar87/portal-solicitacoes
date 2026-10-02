# Memorial Técnico de Desenvolvimento

## Portal de Solicitações Internas

**Projeto:** Portal de Solicitações Internas  
**Repositório:** https://github.com/Dagmar87/portal-solicitacoes  
**Autor:** José Dagmar Florentino da Silva Sobrinho

---

## 1. Objetivo do projeto

O projeto consiste no desenvolvimento de um Portal de Solicitações Internas para permitir que usuários autenticados cadastrem, consultem, editem e excluam solicitações de diferentes áreas da empresa.

A solução foi estruturada com separação entre frontend, backend e banco de dados, buscando manter responsabilidades bem definidas e facilitar manutenção, testes e evolução futura.

As principais funcionalidades implementadas são:

- Autenticação de usuários;
- Cadastro de solicitações;
- Consulta de solicitações;
- Visualização dos detalhes de uma solicitação;
- Edição de solicitações abertas;
- Exclusão de solicitações abertas;
- Atualização do status;
- Filtros por período, categoria, status e título;
- Dashboard com indicadores;
- Validação de dados;
- Tratamento centralizado de erros;
- Proteção das rotas da API;
- Persistência em PostgreSQL;
- Execução local e possibilidade de execução com Docker.

---

## 2. Requisitos funcionais

### 2.1 Autenticação

O sistema possui autenticação baseada em usuário e senha.

Após o login, o backend gera um token JWT utilizado para autenticar as requisições protegidas.

As funcionalidades de autenticação incluem:

- Cadastro de usuário;
- Login;
- Logout no frontend;
- Persistência do token durante a sessão;
- Proteção das rotas privadas;
- Validação do token no backend.

As senhas não são armazenadas em texto puro. O backend utiliza `bcrypt` para geração e validação do hash da senha.

---

### 2.2 Solicitações

Cada solicitação possui os seguintes dados:

- Identificador;
- Título;
- Descrição;
- Categoria;
- Status;
- Usuário responsável pela criação;
- Data de criação;
- Data de atualização.

As categorias disponíveis são:

- TI;
- RH;
- Compras;
- Financeiro;
- Infraestrutura.

Os status disponíveis são:

- ABERTO;
- EM_ATENDIMENTO;
- CONCLUIDO.

Ao criar uma solicitação, o sistema define automaticamente:

- Status inicial como `ABERTO`;
- Usuário autenticado como responsável;
- Data de criação;
- Data de atualização.

---

## 3. Regras de negócio

Foram consideradas as seguintes regras principais:

### 3.1 Criação

Uma solicitação somente pode ser criada por um usuário autenticado.

O `user_id` não é recebido do frontend como informação confiável. O backend utiliza o usuário identificado pelo token JWT.

---

### 3.2 Edição

Somente solicitações com status `ABERTO` podem ser editadas.

Além disso, a aplicação valida se a solicitação pertence ao usuário autenticado antes de permitir a alteração.

Caso a solicitação não exista, o backend retorna erro `404`.

Caso o usuário não seja o responsável pela solicitação, o backend retorna erro `403`.

Caso a solicitação não esteja aberta, a alteração é rejeitada.

---

### 3.3 Exclusão

A exclusão segue regras semelhantes à edição:

- A solicitação deve existir;
- O usuário deve ser o responsável pela solicitação;
- O status deve ser `ABERTO`.

Solicitações em atendimento ou concluídas não podem ser excluídas.

---

### 3.4 Atualização de status

O sistema disponibiliza uma operação específica para alteração do status da solicitação.

Os estados previstos são:

```text
ABERTO
EM_ATENDIMENTO
CONCLUIDO
```

A separação da atualização de status em uma operação própria permite que a alteração do ciclo de atendimento seja tratada de forma independente da edição dos dados cadastrais da solicitação.

---

## 4. Arquitetura da solução

A aplicação foi dividida em três partes principais:

```text
┌──────────────────────────────┐
│          Frontend            │
│       React + Vite           │
└──────────────┬───────────────┘
               │ HTTP / REST
               │ JSON + JWT
               ▼
┌──────────────────────────────┐
│           Backend            │
│      Node.js + Express       │
├──────────────────────────────┤
│ Routes                       │
│ Controllers                  │
│ Services                     │
│ Repositories                 │
│ Validators                   │
│ Middlewares                  │
└──────────────┬───────────────┘
               │ SQL
               ▼
┌──────────────────────────────┐
│         PostgreSQL           │
└──────────────────────────────┘
```

Essa divisão reduz o acoplamento entre as camadas e permite que cada parte da aplicação tenha uma responsabilidade específica.

---

## 5. Backend

### 5.1 Tecnologias

O backend foi desenvolvido utilizando:

- Node.js;
- Express;
- PostgreSQL;
- `pg`;
- JWT;
- bcrypt;
- Zod;
- Helmet;
- CORS;
- Jest;
- Supertest.

---

### 5.2 Organização das responsabilidades

A estrutura do backend segue uma organização por responsabilidades:

```text
backend/src/
├── config/
├── controllers/
├── middlewares/
├── routes/
├── services/
├── repositories/
├── validators/
├── utils/
├── app.js
└── server.js
```

#### Routes

Responsáveis por declarar os endpoints disponíveis e aplicar os middlewares necessários.

#### Controllers

Responsáveis por receber as requisições HTTP, validar os dados de entrada e devolver as respostas HTTP.

#### Services

Concentram as regras de negócio e fazem a comunicação entre controllers e repositories.

#### Repositories

Responsáveis pela comunicação com o PostgreSQL e execução das consultas SQL.

#### Validators

Responsáveis pela validação dos dados recebidos pela API utilizando schemas.

#### Middlewares

Responsáveis por comportamentos transversais, como autenticação e tratamento de erros.

---

## 6. API REST

Os principais endpoints implementados são:

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cadastro de usuário |
| POST | `/api/auth/login` | Autenticação |
| GET | `/api/requests` | Lista solicitações |
| GET | `/api/requests/:id` | Consulta uma solicitação |
| POST | `/api/requests` | Cria uma solicitação |
| PUT | `/api/requests/:id` | Edita uma solicitação |
| DELETE | `/api/requests/:id` | Exclui uma solicitação |
| PATCH | `/api/requests/:id/status` | Atualiza o status |
| GET | `/api/dashboard` | Consulta indicadores |

As rotas de solicitações e dashboard são protegidas por autenticação JWT.

---

## 7. Autenticação e segurança

A autenticação utiliza JWT.

O fluxo implementado é:

```text
Usuário
   │
   │ username + password
   ▼
POST /api/auth/login
   │
   │ valida credenciais
   ▼
JWT
   │
   │ Authorization: Bearer <token>
   ▼
Rotas protegidas
```

As principais medidas adotadas foram:

- Hash de senhas com bcrypt;
- JWT para autenticação;
- Middleware de autenticação;
- Validação de entrada;
- Helmet para cabeçalhos de segurança;
- CORS configurado;
- Uso de variáveis de ambiente para informações sensíveis;
- Separação entre regras de negócio e acesso ao banco.

O segredo utilizado para assinatura do JWT não é versionado no repositório. O projeto utiliza arquivo `.env` local e disponibiliza `.env.example` para configuração.

---

## 8. Banco de dados

O banco utilizado é o PostgreSQL.

Foram criadas as tabelas:

### users

Armazena os usuários do sistema.

Principais campos:

- `id`;
- `username`;
- `password_hash`;
- `created_at`.

### requests

Armazena as solicitações.

Principais campos:

- `id`;
- `title`;
- `description`;
- `category`;
- `status`;
- `user_id`;
- `created_at`;
- `updated_at`.

Existe uma chave estrangeira entre `requests.user_id` e `users.id`.

Também foram definidos `CHECK CONSTRAINTS` para restringir categorias e status aos valores previstos pela aplicação.

Índices foram adicionados em campos utilizados nas consultas, incluindo status, categoria, data de criação e usuário.

---

## 9. Frontend

### 9.1 Tecnologias

O frontend utiliza:

- React;
- Vite;
- React Router;
- Axios;
- Context API;
- CSS.

---

### 9.2 Organização

A estrutura principal é:

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

A aplicação possui páginas e componentes separados para autenticação, dashboard, listagem, detalhes e formulário de solicitações.

---

## 10. Gerenciamento de autenticação no frontend

O estado de autenticação é centralizado em `AuthContext`.

O contexto disponibiliza operações como:

- Login;
- Logout;
- Consulta do usuário autenticado;
- Verificação de autenticação.

O token JWT é utilizado automaticamente nas requisições através de um interceptor do Axios.

As rotas privadas são protegidas pelo componente `ProtectedRoute`.

A estrutura de navegação utiliza um layout protegido contendo cabeçalho e área principal da aplicação.

---

## 11. Interface de solicitações

A interface possui:

- Listagem das solicitações;
- Indicadores visuais de status;
- Filtros;
- Ações de visualização;
- Ações de edição;
- Ação de exclusão quando permitida;
- Formulário de criação;
- Formulário de edição;
- Tela de detalhes;
- Atualização de status.

Os status são apresentados visualmente por meio de um componente reutilizável.

A interface também possui comportamento responsivo para diferentes tamanhos de tela.

---

## 12. Filtros

A listagem de solicitações permite filtrar os registros por:

- Período inicial;
- Período final;
- Categoria;
- Status;
- Título.

Exemplos de parâmetros utilizados pela API:

```text
?category=TI
```

```text
?status=ABERTO
```

```text
?title=computador
```

```text
?startDate=2026-09-01&endDate=2026-09-30
```

Os filtros podem ser combinados para refinar a consulta.

---

## 13. Dashboard

O dashboard apresenta indicadores relacionados às solicitações:

- Total de solicitações;
- Solicitações abertas;
- Solicitações em atendimento;
- Solicitações concluídas.

Esses indicadores são obtidos através do endpoint:

```text
GET /api/dashboard
```

A apresentação dos indicadores permite uma visão rápida da situação atual das solicitações cadastradas.

---

## 14. Tratamento de erros

O backend possui tratamento centralizado de erros.

Os controllers encaminham exceções para o middleware responsável pelo tratamento.

São utilizados códigos HTTP adequados para situações como:

- `400` — dados inválidos ou operação não permitida;
- `401` — falha de autenticação;
- `403` — usuário sem permissão para executar determinada operação;
- `404` — recurso não encontrado;
- `500` — erro interno inesperado.

As validações de entrada são realizadas antes do processamento das operações.

---

## 15. Variáveis de ambiente

As configurações de execução são mantidas em variáveis de ambiente.

Exemplo:

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

O arquivo `.env` deve permanecer fora do controle de versão.

Para facilitar a configuração de novos ambientes, é disponibilizado:

```text
backend/.env.example
```

---

## 16. Execução local

### Backend

Dentro da pasta `backend`:

```bash
npm install
npm run dev
```

O backend fica disponível em:

```text
http://localhost:3000
```

### Frontend

Dentro da pasta `frontend`:

```bash
npm install
npm run dev
```

O frontend fica disponível, por padrão, em:

```text
http://localhost:5173
```

---

## 17. Docker

O projeto possui configuração para execução utilizando Docker Compose.

A proposta é disponibilizar os serviços necessários para execução da aplicação de maneira padronizada, incluindo:

- Backend;
- Frontend;
- PostgreSQL.

Exemplo de execução:

```bash
docker compose up --build
```

Para encerrar:

```bash
docker compose down
```

---

## 18. Testes

O backend foi preparado para testes automatizados utilizando:

- Jest;
- Supertest.

O objetivo é permitir testes das principais operações da API, incluindo autenticação e operações relacionadas às solicitações.

Também é possível realizar testes manuais através de ferramentas como Postman, Insomnia ou diretamente pelo frontend.

---

## 19. Fluxo de teste manual

Uma sequência básica para validar a aplicação é:

### 1. Criar usuário

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

### 2. Fazer login

```http
POST /api/auth/login
```

### 3. Criar uma solicitação

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

### 4. Consultar solicitações

```http
GET /api/requests
```

### 5. Consultar detalhes

```http
GET /api/requests/1
```

### 6. Editar uma solicitação aberta

```http
PUT /api/requests/1
```

### 7. Alterar o status

```http
PATCH /api/requests/1/status
```

Exemplo:

```json
{
  "status": "EM_ATENDIMENTO"
}
```

### 8. Validar restrição de edição

Depois de alterar o status para `EM_ATENDIMENTO` ou `CONCLUIDO`, uma tentativa de edição deve ser rejeitada.

### 9. Validar exclusão

Uma solicitação aberta pode ser excluída. Solicitações que não estejam mais abertas devem ser rejeitadas pela regra de negócio.

---

## 20. Decisões técnicas

### Node.js + Express

A escolha de Node.js com Express proporciona uma estrutura simples para criação de uma API REST, com baixo acoplamento e facilidade para organização em camadas.

### PostgreSQL

O PostgreSQL foi utilizado como banco relacional por oferecer recursos adequados para integridade referencial, constraints, índices e consultas estruturadas.

### React + Vite

React permite estruturar a interface em componentes reutilizáveis, enquanto o Vite oferece um ambiente de desenvolvimento rápido e simples.

### JWT

JWT foi escolhido para autenticação da API, permitindo que as rotas protegidas validem a identidade do usuário através do token enviado no cabeçalho HTTP.

### Zod

Zod foi utilizado para validar estruturas de entrada antes que os dados sejam processados pelas regras de negócio.

### Docker

A configuração Docker/Compose foi considerada para facilitar a padronização do ambiente e permitir que o projeto seja executado de maneira mais previsível em diferentes máquinas.

---

## 21. Separação de responsabilidades

A separação entre Controller, Service e Repository foi adotada para evitar que as regras de negócio fiquem concentradas nos endpoints.

Exemplo do fluxo de criação:

```text
HTTP Request
     │
     ▼
Controller
     │
     │ valida dados
     ▼
Service
     │
     │ aplica regras
     ▼
Repository
     │
     │ executa SQL
     ▼
PostgreSQL
```

Essa estrutura facilita manutenção, testes e evolução do sistema.

---

## 22. Considerações finais

O projeto foi desenvolvido buscando atender aos requisitos funcionais do Portal de Solicitações Internas e, ao mesmo tempo, manter uma estrutura organizada para evolução.

As principais preocupações técnicas foram:

- Separação de responsabilidades;
- Segurança da autenticação;
- Validação dos dados;
- Integridade do banco;
- Regras de negócio no backend;
- Reutilização de componentes no frontend;
- Tratamento de erros;
- Organização do código;
- Facilidade de execução local;
- Possibilidade de containerização;
- Preparação para testes automatizados.

A arquitetura permite que novas funcionalidades sejam incorporadas posteriormente sem a necessidade de concentrar toda a lógica em um único módulo ou camada.

---

## 23. Estrutura final resumida

```text
portal-solicitacoes/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
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
└── MEMORIAL-TECNICO.md
```

---

**Documento:** Memorial Técnico de Desenvolvimento  
**Projeto:** Portal de Solicitações Internas  
**Autor:** José Dagmar Florentino da Silva Sobrinho
