# Contexto do Projeto — Achei no Campus

## 1. Visão geral

O Achei no Campus é uma aplicação web desenvolvida para facilitar a divulgação e recuperação de objetos perdidos e encontrados no Instituto Federal do Ceará (IFCE) – Campus Fortaleza.

O projeto tem como objetivo centralizar as informações sobre objetos perdidos e encontrados, permitindo que os usuários cadastrem objetos, consultem registros e acompanhem sua situação.

Quando um usuário encontrar um objeto, poderá cadastrá-lo na aplicação e encaminhá-lo ao setor de Achados e Perdidos mais próximo.

Quando o objeto for recuperado ou devolvido ao proprietário, seu status deverá ser atualizado no banco de dados.

O projeto está sendo desenvolvido como atividade acadêmica da disciplina de Banco de Dados.

## 2. Tecnologias definidas

- **Front-end:** HTML5, CSS3 e JavaScript puro.
- **Back-end:** Node.js com Express.
- **Banco de dados:** PostgreSQL.
- **Hospedagem do banco:** Supabase.

Não substituir essas tecnologias por frameworks diferentes sem autorização.

A comunicação deverá seguir a arquitetura:

**Front-end → API Express → PostgreSQL (Supabase)**

## 3. Estrutura atualizada do banco de dados

O banco de dados deverá possuir quatro tabelas:

1. `usuarios`
2. `categorias`
3. `locais`
4. `objetos`

A tabela `solicitacoes`, presente na proposta anterior, foi removida por orientação do professor.

### Tabela `usuarios`

Responsável por armazenar as informações dos usuários cadastrados.

Campos:

- `id_usuarios` — INT, chave primária, IDENTITY.
- `nome` — VARCHAR(45).
- `senha` — VARCHAR(255).
- `data_cadastro` — TIMESTAMP, DEFAULT CURRENT_TIMESTAMP.
- `email` — VARCHAR(45).

Um usuário poderá cadastrar vários objetos perdidos ou encontrados.

**Atenção:** a chave primária utiliza o nome `id_usuarios`, no plural. A chave estrangeira correspondente na tabela `objetos` utiliza `id_usuario`, no singular.

### Tabela `categorias`

Responsável por classificar os objetos cadastrados.

Campos:

- `id_categoria` — INT, chave primária, IDENTITY.
- `nome` — VARCHAR(45).
- `descricao` — TEXT.

Exemplos de categorias:

- Eletrônicos
- Documentos
- Acessórios
- Material escolar
- Outros

Uma categoria poderá estar associada a vários objetos.

### Tabela `locais`

Responsável por armazenar informações sobre os locais do campus.

Campos:

- `id_local` — INT, chave primária, IDENTITY.
- `nome` — VARCHAR(45).
- `bloco` — VARCHAR(45).
- `descricao` — TEXT.

Os locais poderão representar pontos de ocorrência ou setores de Achados e Perdidos.

Um local poderá estar associado a vários objetos.

**Observação:** o esquema atual possui apenas `id_local` na tabela `objetos`. Portanto, ele ainda não diferencia o local da ocorrência do local onde o objeto foi entregue. Caso seja necessário registrar os dois, apresentar uma proposta de alteração antes de modificar o banco.

### Tabela `objetos`

Responsável por armazenar os registros de objetos perdidos e encontrados.

Campos:

- `id_objeto` — INT, chave primária, IDENTITY.
- `titulo` — VARCHAR(45).
- `descricao` — TEXT.
- `cor` — VARCHAR(45).
- `tipo` — VARCHAR(45).
- `status` — VARCHAR(45), novo campo.
- `data_ocorrencia` — DATE.
- `id_usuario` — INT, chave estrangeira.
- `id_categoria` — INT, chave estrangeira.
- `id_local` — INT, chave estrangeira.

Relacionamentos:

- `id_usuario` referencia `usuarios.id_usuarios`.
- `id_categoria` referencia `categorias.id_categoria`.
- `id_local` referencia `locais.id_local`.

## 4. Lógica de funcionamento dos objetos

A tabela `objetos` deverá utilizar dois campos distintos para controlar o registro.

### Campo `tipo`

Identifica a natureza do cadastro.

Valores permitidos:

- `perdido`: objeto que o usuário perdeu.
- `encontrado`: objeto que o usuário encontrou.

O tipo não deve ser confundido com a situação atual do objeto.

### Campo `status`

Identifica a situação da recuperação.

Valores permitidos:

- `pendente`: objeto que ainda não foi recuperado ou devolvido.
- `devolvido`: objeto recuperado ou entregue ao proprietário.

Todo objeto cadastrado deverá receber inicialmente o status `pendente`.

Após a confirmação da recuperação ou devolução, o status deverá ser atualizado para `devolvido`.

Essa atualização deverá ser realizada por um usuário autorizado.

### Exemplo de funcionamento

1. Um usuário perde um fone de ouvido no campus.
2. Ele cadastra o objeto com `tipo = 'perdido'`.
3. O sistema registra `status = 'pendente'`.
4. Outra pessoa encontra o objeto e o encaminha ao setor de Achados e Perdidos.
5. Após a confirmação de que o proprietário recuperou o objeto, o registro original recebe `status = 'devolvido'`.

Um usuário também poderá cadastrar diretamente um objeto encontrado, utilizando `tipo = 'encontrado'`.

**Importante:** a identificação de registros duplicados ou correspondentes entre objetos perdidos e encontrados ainda não foi definida. Não implementar associação automática sem autorização.

## 5. Relacionamentos entre as tabelas

O banco de dados possuirá três relacionamentos do tipo um para muitos (1:N):

- `usuarios` (1:N) `objetos`
- `categorias` (1:N) `objetos`
- `locais` (1:N) `objetos`

Esses relacionamentos deverão ser implementados utilizando chaves estrangeiras.

Não criar novamente a tabela `solicitacoes`.

## 6. Funcionalidades previstas

A aplicação deverá permitir:

1. Cadastro e autenticação de usuários.
2. Cadastro de objetos perdidos.
3. Cadastro de objetos encontrados.
4. Consulta dos objetos registrados.
5. Pesquisa por título, descrição e localização.
6. Filtragem por categoria.
7. Filtragem por tipo: perdido ou encontrado.
8. Filtragem por status: pendente ou devolvido.
9. Visualização dos detalhes de cada objeto.
10. Atualização do status após a confirmação da recuperação ou devolução.

As funcionalidades listadas são requisitos previstos e não devem ser consideradas implementadas sem verificação do código existente.

## 7. Integração com o front-end

O projeto já possui uma interface desenvolvida com HTML, CSS e JavaScript puro.

Antes de realizar alterações:

- Analisar os arquivos existentes.
- Identificar quais funcionalidades já estão implementadas.
- Preservar a identidade visual, o layout e a responsividade.
- Não substituir componentes existentes sem necessidade.
- Evitar alterações em arquivos não relacionados à tarefa.
- Não modificar HTML ou CSS quando a solicitação envolver apenas JavaScript.

O catálogo de objetos utiliza dados demonstrativos em JavaScript.

Durante a integração, esses dados deverão ser substituídos por informações retornadas pela API Express.

Os filtros existentes deverão ser preservados e adaptados à estrutura do banco.

## 8. Orientações para o back-end

Utilizar Node.js e Express para desenvolver a API.

Rotas previstas:

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/api/objetos` | Listar e filtrar objetos |
| GET | `/api/objetos/:id` | Consultar um objeto |
| POST | `/api/objetos` | Cadastrar um objeto |
| PATCH | `/api/objetos/:id/status` | Atualizar o status |
| GET | `/api/categorias` | Listar categorias |
| GET | `/api/locais` | Listar locais |

As rotas de autenticação deverão ser definidas separadamente.

A atualização do status deverá validar os valores permitidos e verificar se o usuário possui autorização para modificar o registro.

Não criar rotas relacionadas a solicitações, pois essa funcionalidade foi removida do projeto.

## 9. Regras de segurança

- Armazenar senhas utilizando hashes seguros, como Argon2id ou bcrypt.
- Validar os dados recebidos pela API.
- Utilizar consultas SQL parametrizadas.
- Proteger operações que exigem autenticação.
- Não confiar em IDs enviados pelo navegador para identificar o usuário autenticado.
- Armazenar credenciais do PostgreSQL em variáveis de ambiente.
- Não expor credenciais privadas do Supabase no front-end.
- Não realizar alterações destrutivas no banco sem autorização.

## 10. Regras para alterações no projeto

Ao receber uma tarefa:

1. Analisar os arquivos relevantes antes de modificar qualquer código.
2. Consultar o README e o arquivo SQL do banco.
3. Explicar quais alterações serão necessárias.
4. Preservar as funcionalidades existentes.
5. Não alterar tabelas, colunas ou relacionamentos sem autorização.
6. Não adicionar dependências desnecessárias.
7. Manter o código organizado e compreensível.
8. Informar quais arquivos foram modificados.
9. Executar os testes disponíveis e relatar os resultados.
10. Não afirmar que uma funcionalidade está pronta sem verificar sua implementação.

Priorizar alterações pequenas, objetivas e compatíveis com a estrutura existente.

## 11. Objetivo atual do desenvolvimento

O banco de dados está passando por uma revisão solicitada pelo professor.

As mudanças aprovadas são:

- Remover a tabela `solicitacoes`.
- Manter as tabelas `usuarios`, `categorias`, `locais` e `objetos`.
- Adicionar o campo `status` à tabela `objetos`.
- Utilizar os valores `pendente` e `devolvido`.
- Permitir que usuários cadastrem objetos perdidos ou encontrados.
- Atualizar o status quando houver confirmação da recuperação ou devolução.

O Codex deverá verificar se essas alterações já foram aplicadas ao `schema.sql` e ao banco de dados no Supabase.

Não presumir que a documentação representa o estado atual do banco. Comparar o esquema real com o modelo proposto antes de implementar alterações.

A próxima etapa será atualizar o SQL, verificar a estrutura do banco e planejar a integração com Node.js e Express.