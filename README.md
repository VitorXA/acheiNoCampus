
# Achei no Campus

## Versão publicada

O [Achei no Campus](https://achei-no-campus-eight.vercel.app/) reúne o frontend e a API Express no Vercel. O Supabase hospeda o PostgreSQL e as fotos do catálogo.

A versão publicada inclui criação de conta, login, logout, registro de objeto perdido ou encontrado com foto opcional, catálogo público, busca, filtros e detalhes da ficha. O cadastro agrupa os locais por bloco.

Para rodar localmente, configure `back-end/.env` a partir de `back-end/.env.example`, execute `npm ci` e `npm start` em `back-end` e abra `http://localhost:3000`. O Express serve o frontend no mesmo endereço. Use uma chave aleatória de pelo menos 32 caracteres para `JWT_SECRET`. Para testar fotos, configure também o bucket `fotos-objetos` e a variável `SUPABASE_SECRET_KEY` no servidor. Consulte o [guia do banco](database/README.md) para preparar a estrutura.

As seções abaixo registram o planejamento original do projeto, incluindo funcionalidades e destinos de hospedagem considerados durante o desenvolvimento.

O **Achei no Campus** é uma aplicação web desenvolvida para centralizar o registro, a consulta e a recuperação de objetos perdidos e encontrados no **Instituto Federal de Educação, Ciência e Tecnologia do Ceará (IFCE) — Campus Fortaleza**.

O projeto surgiu da necessidade de melhorar a comunicação entre estudantes, professores, servidores e demais integrantes da comunidade acadêmica que perderam algum pertence ou encontraram um objeto dentro da instituição.

A plataforma permitirá que os usuários registrem ocorrências, consultem objetos cadastrados e utilizem ferramentas de pesquisa e filtragem para localizar itens com mais facilidade.

A proposta é substituir a divulgação dispersa de informações por um ambiente digital organizado, acessível e colaborativo.

## 1. Objetivo do projeto

O principal objetivo do Achei no Campus é facilitar a recuperação de objetos perdidos e encontrados no ambiente acadêmico por meio de uma plataforma web.

O sistema busca:

- Centralizar as informações sobre objetos perdidos e encontrados.
- Facilitar a comunicação entre os membros da comunidade acadêmica.
- Permitir o registro e a consulta de ocorrências.
- Organizar os objetos por categorias e locais.
- Oferecer ferramentas de pesquisa e filtragem.
- Reduzir as dificuldades para localizar pertences perdidos.
- Incentivar a colaboração entre estudantes e servidores.

Inicialmente, a aplicação será direcionada ao IFCE — Campus Fortaleza, considerando os locais e as necessidades da instituição.

## 2. Funcionalidades previstas

O sistema será desenvolvido para oferecer as seguintes funcionalidades.

### 2.1. Cadastro e autenticação de usuários

Os usuários poderão criar uma conta para utilizar as funcionalidades de registro e gerenciamento de objetos.

O sistema contará com:

- Cadastro de usuários.
- Login por e-mail e senha.
- Autenticação para acesso às funcionalidades restritas.
- Identificação do usuário responsável por cada registro.
- Gerenciamento dos registros realizados pelo usuário.

As senhas serão armazenadas de forma segura, utilizando algoritmos apropriados de hash.

### 2.2. Registro de objetos

Os usuários autenticados poderão cadastrar objetos perdidos ou encontrados.

Cada registro poderá conter:

- Título do objeto.
- Descrição.
- Cor.
- Tipo de ocorrência (perdido ou encontrado).
- Data da ocorrência.
- Categoria do objeto.
- Local da ocorrência.
- Usuário responsável pelo registro.

Os registros serão armazenados no banco de dados e disponibilizados para consulta na plataforma.

### 2.3. Consulta de objetos

A aplicação disponibilizará uma página para visualizar os objetos registrados.

Os usuários poderão consultar informações sobre cada objeto, incluindo sua descrição, categoria, local e data da ocorrência.

### 2.4. Pesquisa e filtragem

O sistema oferecerá ferramentas para facilitar a localização de objetos.

As opções previstas incluem:

- Pesquisa pelo título do objeto.
- Pesquisa por palavras presentes na descrição.
- Filtragem por categoria.
- Filtragem por local.
- Filtragem pelo tipo de ocorrência.
- Consulta de registros associados a um usuário.

### 2.5. Gerenciamento de registros

Os usuários autenticados poderão gerenciar os registros de objetos associados às suas contas.

As operações previstas incluem:

- Criar novos registros.
- Consultar registros existentes.
- Editar informações dos próprios registros.
- Excluir registros de sua responsabilidade.

### 2.6. Interface responsiva

A interface será desenvolvida para funcionar em diferentes dispositivos, incluindo:

- Computadores.
- Notebooks.
- Tablets.
- Smartphones.

O objetivo é permitir o acesso à plataforma diretamente pelo navegador, sem necessidade de instalação.

## 3. Tecnologias utilizadas

O Achei no Campus utilizará uma arquitetura web com frontend, backend e banco de dados separados.

### 3.1. Frontend

**HTML5**

Responsável pela estrutura das páginas, formulários e componentes da interface.

**CSS3**

Utilizado para estilização, organização visual e adaptação da interface a diferentes tamanhos de tela.

**JavaScript**

Responsável pela interatividade, validação de formulários, manipulação dos elementos da página e comunicação com o backend.

O frontend será desenvolvido com HTML, CSS e JavaScript puro, sem a utilização de frameworks.

### 3.2. Backend

**Node.js**

Ambiente de execução JavaScript utilizado para desenvolver a lógica do servidor.

**Express.js**

Framework utilizado para construir a API REST responsável pela comunicação entre o frontend e o banco de dados.

O backend será responsável por:

- Receber e processar requisições HTTP.
- Gerenciar o cadastro e a autenticação de usuários.
- Validar os dados recebidos.
- Realizar operações de criação, consulta, atualização e exclusão.
- Aplicar regras de negócio.
- Controlar o acesso aos registros.
- Executar consultas ao banco de dados.

### 3.3. Banco de dados

**PostgreSQL**

Banco de dados relacional responsável pelo armazenamento das informações do sistema.

**Supabase**

Plataforma utilizada para hospedar e gerenciar o banco de dados PostgreSQL na nuvem.

O Supabase será utilizado como infraestrutura de banco de dados, enquanto as regras de negócio e a comunicação com o frontend ficarão sob responsabilidade do backend Node.js.

### 3.4. Versionamento

**Git**

Utilizado para controlar as alterações realizadas no código-fonte.

**GitHub**

Responsável pelo armazenamento remoto do repositório e acompanhamento do desenvolvimento.

### 3.5. Hospedagem

**GitHub Pages**

Hospedagem da interface frontend.

**Render**

Hospedagem da API desenvolvida com Node.js e Express.

**Supabase**

Hospedagem do banco de dados PostgreSQL.

## 4. Arquitetura do sistema

O projeto seguirá uma arquitetura cliente-servidor, com separação entre interface, lógica de negócio e armazenamento de dados.

```text
              USUÁRIO
                 |
                 v
        NAVEGADOR WEB
                 |
                 v
        FRONTEND (GitHub Pages)
        HTML + CSS + JavaScript
                 |
                 | Requisições HTTP
                 | API REST / JSON
                 v
        BACKEND (Render)
        Node.js + Express
                 |
                 | Consultas SQL
                 v
        BANCO DE DADOS
        PostgreSQL (Supabase)
```

### Funcionamento

1. O usuário acessa o Achei no Campus pelo navegador.
2. O frontend apresenta a interface e recebe as interações.
3. Quando necessário, o JavaScript envia requisições HTTP para a API.
4. O backend recebe a requisição, valida os dados e executa as regras de negócio.
5. O backend consulta ou modifica as informações no PostgreSQL.
6. O banco de dados retorna o resultado da operação.
7. A API devolve uma resposta em JSON ao frontend.
8. A interface apresenta as informações ao usuário.

Essa separação permite organizar o desenvolvimento e realizar manutenções em cada parte da aplicação de maneira independente.

## 5. Estrutura de pastas e arquivos

A estrutura prevista para o repositório é:

```text
acheiNoCampus/
|
|-- front-end/
|   |
|   |-- index.html
|   |
|   |-- pages/
|   |   |-- login.html
|   |   |-- cadastro.html
|   |   |-- objetos.html
|   |   |-- objeto-detalhes.html
|   |   |-- cadastrar-objeto.html
|   |   |-- meus-registros.html
|   |
|   |-- css/
|   |   |-- style.css
|   |   |-- responsive.css
|   |
|   |-- js/
|   |   |-- script.js
|   |   |-- api.js
|   |   |-- auth.js
|   |   |-- objetos.js
|   |   |-- filtros.js
|   |
|   |-- assets/
|       |-- images/
|       |-- icons/
|
|-- back-end/
|   |
|   |-- src/
|   |   |
|   |   |-- server.js
|   |   |-- app.js
|   |   |
|   |   |-- config/
|   |   |   |-- database.js
|   |   |
|   |   |-- routes/
|   |   |   |-- auth.routes.js
|   |   |   |-- usuarios.routes.js
|   |   |   |-- objetos.routes.js
|   |   |   |-- categorias.routes.js
|   |   |   |-- locais.routes.js
|   |   |
|   |   |-- controllers/
|   |   |   |-- auth.controller.js
|   |   |   |-- usuarios.controller.js
|   |   |   |-- objetos.controller.js
|   |   |   |-- categorias.controller.js
|   |   |   |-- locais.controller.js
|   |   |
|   |   |-- services/
|   |   |   |-- auth.service.js
|   |   |   |-- objetos.service.js
|   |   |
|   |   |-- repositories/
|   |   |   |-- usuarios.repository.js
|   |   |   |-- objetos.repository.js
|   |   |   |-- categorias.repository.js
|   |   |   |-- locais.repository.js
|   |   |
|   |   |-- middlewares/
|   |   |   |-- auth.middleware.js
|   |   |   |-- error.middleware.js
|   |   |
|   |   |-- utils/
|   |       |-- validators.js
|   |
|   |-- package.json
|   |-- package-lock.json
|   |-- .env.example
|   |-- .gitignore
|
|-- database/
|   |-- schema.sql
|   |-- seed.sql
|
|-- .gitignore
|-- README.md
```

Essa organização representa a estrutura planejada para o projeto completo. Os diretórios e arquivos serão implementados conforme o avanço do desenvolvimento.

### 5.1. Frontend

A pasta `front-end/` conterá os arquivos responsáveis pela interface da aplicação.

**Arquivos principais:**

- `index.html`: página inicial do sistema.
- `pages/login.html`: página de autenticação.
- `pages/cadastro.html`: formulário de cadastro de usuários.
- `pages/objetos.html`: listagem dos objetos registrados.
- `pages/objeto-detalhes.html`: informações detalhadas de um objeto.
- `pages/cadastrar-objeto.html`: formulário para registrar objetos.
- `pages/meus-registros.html`: gerenciamento dos registros do usuário.

**CSS:**

- `style.css`: estilos gerais e identidade visual.
- `responsive.css`: adaptações para diferentes dispositivos.

**JavaScript:**

- `script.js`: interações gerais da interface.
- `api.js`: comunicação com a API REST.
- `auth.js`: funcionalidades relacionadas à autenticação.
- `objetos.js`: operações e exibição de objetos.
- `filtros.js`: pesquisa e filtragem dos registros.

**Assets:**

- `images/`: imagens utilizadas na interface.
- `icons/`: ícones e recursos gráficos.

### 5.2. Backend

A pasta `back-end/` conterá a API REST desenvolvida com Node.js e Express.

A organização seguirá uma separação de responsabilidades.

**config/**

Configurações utilizadas pela aplicação, incluindo a conexão com o PostgreSQL.

**routes/**

Definição dos endpoints HTTP disponibilizados pela API.

**controllers/**

Recebimento das requisições, tratamento das entradas e envio das respostas.

**services/**

Implementação das regras de negócio.

**repositories/**

Acesso ao banco de dados e execução das consultas SQL.

**middlewares/**

Funções intermediárias responsáveis pela autenticação, controle de acesso e tratamento de erros.

**utils/**

Funções auxiliares utilizadas em diferentes partes do backend.

**Arquivos principais:**

- `server.js`: inicialização do servidor HTTP.
- `app.js`: configuração da aplicação Express.
- `package.json`: dependências e scripts do projeto.
- `.env.example`: modelo das variáveis de ambiente.
- `.gitignore`: arquivos que não devem ser versionados.

### 5.3. Banco de dados

A pasta `database/` conterá os scripts SQL relacionados à estrutura e aos dados iniciais do banco.

- `schema.sql`: criação das tabelas, chaves e relacionamentos.
- `seed.sql`: inserção de dados iniciais para desenvolvimento e testes.

O banco de dados será executado no Supabase.

## 6. Modelagem do banco de dados

O banco de dados foi planejado para armazenar informações de usuários, categorias, locais e objetos.

Inicialmente, serão utilizadas quatro tabelas principais.

### 6.1. Tabela `usuarios`

Armazena as informações dos usuários cadastrados.

| Campo | Tipo | Descrição |
|---|---|---|
| id_usuarios | INT | Identificador do usuário |
| nome | VARCHAR(45) | Nome do usuário |
| senha | VARCHAR(255) | Hash da senha |
| data_cadastro | TIMESTAMP | Data do cadastro |
| email | VARCHAR(45) | E-mail do usuário |

A chave primária será `id_usuarios`.

### 6.2. Tabela `categorias`

Organiza os objetos por categorias.

| Campo | Tipo | Descrição |
|---|---|---|
| id_categoria | INT | Identificador da categoria |
| nome | VARCHAR(45) | Nome da categoria |
| descricao | TEXT | Descrição da categoria |

A chave primária será `id_categoria`.

### 6.3. Tabela `locais`

Armazena os locais do campus relacionados às ocorrências.

| Campo | Tipo | Descrição |
|---|---|---|
| id_local | INT | Identificador do local |
| nome | VARCHAR(45) | Nome do local |
| bloco | VARCHAR(45) | Bloco do campus |
| descricao | TEXT | Informações adicionais |

A chave primária será `id_local`.

### 6.4. Tabela `objetos`

Armazena as informações dos objetos perdidos e encontrados.

| Campo | Tipo | Descrição |
|---|---|---|
| id_objeto | INT | Identificador do objeto |
| titulo | VARCHAR(45) | Título do registro |
| descricao | TEXT | Descrição do objeto |
| cor | VARCHAR(45) | Cor do objeto |
| tipo | VARCHAR(45) | Perdido ou encontrado |
| data_ocorrencia | DATE | Data da ocorrência |
| id_usuario | INT | Usuário responsável |
| id_categoria | INT | Categoria do objeto |
| id_local | INT | Local da ocorrência |

A chave primária será `id_objeto`.

Os campos `id_usuario`, `id_categoria` e `id_local` serão chaves estrangeiras.

### 6.5. Relacionamentos

O banco de dados utilizará os seguintes relacionamentos:

**Usuários e objetos (1:N)**

Um usuário poderá registrar vários objetos, mas cada registro estará associado a um usuário responsável.

**Categorias e objetos (1:N)**

Uma categoria poderá estar associada a vários objetos, mas cada objeto pertencerá a uma categoria.

**Locais e objetos (1:N)**

Um local poderá estar associado a vários registros de objetos, mas cada registro estará relacionado a um local.

Representação simplificada:

```text
USUARIOS (1) -------- (N) OBJETOS
                            |
CATEGORIAS (1) ----- (N) ---|
                            |
LOCAIS (1) --------- (N) ---|
```

A utilização de chaves primárias e estrangeiras permitirá manter a integridade dos relacionamentos entre as tabelas.

## 7. API REST

A API será responsável por disponibilizar as operações necessárias para o funcionamento do sistema.

Os endpoints previstos incluem:

### Autenticação

| Método | Endpoint | Descrição |
|---|---|---|
| POST | /api/auth/register | Cadastrar usuário |
| POST | /api/auth/login | Autenticar usuário |
| GET | /api/auth/me | Consultar usuário autenticado |

### Objetos

| Método | Endpoint | Descrição |
|---|---|---|
| GET | /api/objetos | Listar e pesquisar objetos |
| GET | /api/objetos/:id | Consultar objeto específico |
| POST | /api/objetos | Cadastrar objeto |
| PUT | /api/objetos/:id | Atualizar objeto |
| DELETE | /api/objetos/:id | Excluir objeto |

### Categorias

| Método | Endpoint | Descrição |
|---|---|---|
| GET | /api/categorias | Listar categorias |
| GET | /api/categorias/:id | Consultar categoria |

### Locais

| Método | Endpoint | Descrição |
|---|---|---|
| GET | /api/locais | Listar locais |
| GET | /api/locais/:id | Consultar local |

### Usuários

| Método | Endpoint | Descrição |
|---|---|---|
| GET | /api/usuarios/me/objetos | Consultar registros do usuário |

As rotas de criação, atualização e exclusão de objetos exigirão autenticação. A edição e a exclusão também dependerão da autorização do usuário responsável pelo registro.

Os endpoints representam o planejamento da API e poderão ser ajustados durante a implementação.

## 8. Configuração do ambiente

### 8.1. Pré-requisitos

Para executar o projeto localmente, serão necessários:

- Git.
- Node.js e npm.
- Editor de código, como Visual Studio Code.
- Navegador web.
- Projeto configurado no Supabase para acesso ao PostgreSQL.

### 8.2. Clonar o repositório

```bash
git clone https://github.com/VitorXA/acheiNoCampus.git
```

Acesse o diretório:

```bash
cd acheiNoCampus
```

### 8.3. Executar o frontend

Acesse a pasta:

```bash
cd front-end
```

Abra o arquivo `index.html` no navegador.

Também será possível utilizar a extensão Live Server do Visual Studio Code para executar a interface durante o desenvolvimento.

### 8.4. Configurar o backend

Após sua implementação, acesse o diretório:

```bash
cd back-end
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` a partir do `.env.example`.

Exemplo de configuração:

```env
PORT=3000
FRONTEND_URL=http://127.0.0.1:5500
DATABASE_URL=postgresql://USUARIO:SENHA@HOST:PORTA/BANCO
JWT_SECRET=SUBSTITUA_POR_UMA_CHAVE_SEGURA
```

A variável `DATABASE_URL` deverá conter a string de conexão disponibilizada pelo Supabase.

O arquivo `.env` não deverá ser enviado ao GitHub, pois contém informações sensíveis.

O comando de inicialização será definido nos scripts do `package.json` durante a implementação do backend.

## 9. Publicação da aplicação

A aplicação utilizará serviços de hospedagem separados para cada camada.

### Frontend — GitHub Pages

O frontend será publicado no GitHub Pages, permitindo o acesso diretamente pelo navegador.

A publicação deverá apontar para os arquivos estáticos da aplicação. Caso seja utilizada a publicação convencional por branch, os arquivos poderão precisar ser disponibilizados na raiz ou em uma pasta `/docs`, conforme a configuração escolhida.

### Backend — Render

A API Node.js será hospedada no Render.

O serviço será responsável por receber as requisições do frontend e executar as operações do sistema.

As variáveis de ambiente serão configuradas diretamente no ambiente de hospedagem.

### Banco de dados — Supabase

O PostgreSQL será hospedado no Supabase.

O backend realizará a conexão com o banco por meio de credenciais armazenadas em variáveis de ambiente.

O frontend não terá acesso direto às credenciais do PostgreSQL.

## 10. Segurança

O projeto prevê a adoção de medidas básicas de segurança, incluindo:

- Armazenamento de senhas por meio de hash seguro.
- Autenticação de usuários.
- Autorização para operações restritas.
- Validação dos dados recebidos pela API.
- Consultas SQL parametrizadas.
- Proteção das credenciais por variáveis de ambiente.
- Configuração de CORS para permitir origens autorizadas.
- Tratamento de erros sem exposição de informações internas.
- Utilização de HTTPS na comunicação com os serviços hospedados.

As medidas serão implementadas e verificadas durante o desenvolvimento.

## 11. Etapas de desenvolvimento

O desenvolvimento do Achei no Campus será organizado em etapas.

### Etapa 1 — Planejamento e modelagem

- Definição do problema.
- Levantamento dos requisitos.
- Definição das funcionalidades.
- Escolha das tecnologias.
- Modelagem do banco de dados.
- Definição das entidades e relacionamentos.
- Planejamento da arquitetura do sistema.

### Etapa 2 — Desenvolvimento do frontend

- Construção das páginas HTML.
- Desenvolvimento da identidade visual.
- Estilização com CSS.
- Adaptação para diferentes dispositivos.
- Implementação das interações com JavaScript.
- Construção dos formulários.
- Desenvolvimento da pesquisa e dos filtros.

### Etapa 3 — Desenvolvimento do backend

- Configuração do Node.js e Express.
- Organização das rotas e controllers.
- Conexão com PostgreSQL.
- Implementação das operações CRUD.
- Desenvolvimento da autenticação.
- Validação dos dados.
- Implementação das regras de negócio.

### Etapa 4 — Integração

- Conexão do frontend com a API.
- Integração da API com o Supabase.
- Testes de cadastro e autenticação.
- Testes de criação e consulta de objetos.
- Testes dos filtros e da pesquisa.
- Verificação das permissões de acesso.

### Etapa 5 — Testes e publicação

- Correção de erros.
- Testes de funcionamento.
- Verificação da responsividade.
- Revisão das funcionalidades.
- Publicação do frontend no GitHub Pages.
- Publicação do backend no Render.
- Configuração do banco de dados em produção.

## 12. Melhorias futuras

Após a implementação das funcionalidades principais, o projeto poderá receber melhorias como:

- Upload de imagens dos objetos.
- Atualização do status de recuperação.
- Solicitação de devolução de objetos.
- Notificações sobre possíveis correspondências.
- Histórico de objetos recuperados.
- Painel administrativo para moderação dos registros.
- Melhorias na pesquisa e nos filtros.
- Ampliação da plataforma para outros campi.

Essas funcionalidades não fazem parte necessariamente da primeira versão e dependerão da evolução do projeto.

## 13. Contribuição

O Achei no Campus é um projeto acadêmico voltado à aplicação prática de conhecimentos de desenvolvimento web e banco de dados.

Sugestões, correções e contribuições poderão ajudar a melhorar a plataforma e ampliar sua utilidade para a comunidade acadêmica.

## 14. Licença

O projeto foi desenvolvido para fins acadêmicos e de aprendizado.

A licença de distribuição e utilização do código ainda será definida.
