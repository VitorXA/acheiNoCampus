# Achei no Campus — Banco de Dados

## Scripts da versão publicada

Em um novo projeto Supabase, aplique os scripts nesta ordem:

1. `schema.sql` cria as tabelas de negócio e a view do catálogo.
2. `adicionar-foto-objetos.sql` adiciona a coluna de foto quando o banco foi criado com um esquema anterior.
3. `seguranca.sql` cria o armazenamento de sessões e limites, ativa a proteção por linha e aplica a unicidade dos e-mails.
4. `seed.sql` adiciona categorias, locais e blocos sem duplicar o conjunto inicial.
5. `permissoes-aplicacao.sql` concede permissões de execução ao papel PostgreSQL `achei_app`. Crie o papel com uma senha própria e configure a string de conexão correspondente como segredo no servidor antes de usá-lo.

As imagens ficam no bucket público `fotos-objetos` do Supabase Storage. O banco guarda a referência da imagem em cada ficha.

## Sobre o projeto

O Achei no Campus é uma aplicação web desenvolvida para facilitar a divulgação e recuperação de objetos perdidos e encontrados no Instituto Federal do Ceará (IFCE) – Campus Fortaleza.

A aplicação busca centralizar informações sobre objetos perdidos e encontrados no ambiente acadêmico, permitindo que estudantes e outros membros da comunidade registrem objetos e consultem os registros disponíveis.

Os objetos encontrados poderão ser encaminhados ao setor de Achados e Perdidos mais próximo, facilitando sua recuperação pelos proprietários.

## Tecnologias utilizadas

- **Front-end:** HTML5, CSS3 e JavaScript.
- **Back-end:** Node.js e Express.
- **Banco de dados:** PostgreSQL.
- **Hospedagem do banco:** Supabase.

A aplicação utilizará uma API desenvolvida com Node.js e Express para realizar operações no PostgreSQL.

## Funcionamento da aplicação

O sistema permitirá que um usuário cadastrado registre um objeto que perdeu ou encontrou no campus.

Durante o cadastro, o usuário deverá informar as características do objeto, sua categoria, o local relacionado à ocorrência e o tipo de registro.

O campo `tipo` identificará se o objeto foi perdido ou encontrado.

O campo `status` indicará a situação da recuperação do objeto:

- **pendente:** o objeto ainda não foi recuperado ou devolvido ao proprietário.
- **devolvido:** o objeto foi recuperado ou entregue ao seu proprietário.

Quando um objeto encontrado for encaminhado ao setor de Achados e Perdidos, o registro poderá informar o local onde ele está disponível para retirada.

Após a confirmação da devolução, o status do objeto será atualizado no banco de dados.

Dessa forma, não será necessária uma tabela de solicitações, pois o acompanhamento da situação do objeto será realizado diretamente na tabela `objetos`.

## Estrutura do banco de dados

O banco de dados será composto por quatro tabelas principais.

### 1. Tabela `usuarios`

Armazena as informações dos usuários cadastrados na aplicação.

| Campo | Tipo | Descrição |
|---|---|---|
| id_usuarios | INT | Chave primária |
| nome | VARCHAR(45) | Nome do usuário |
| senha | VARCHAR(255) | Hash da senha |
| data_cadastro | TIMESTAMP | Data do cadastro |
| email | VARCHAR(45) | Email do usuário |

**Relacionamento:**

Um usuário pode cadastrar vários objetos perdidos ou encontrados, enquanto cada objeto possui um usuário responsável pelo cadastro.

Cardinalidade: **1:N**.

### 2. Tabela `categorias`

Armazena as categorias utilizadas para classificar os objetos cadastrados.

| Campo | Tipo | Descrição |
|---|---|---|
| id_categoria | INT | Chave primária |
| nome | VARCHAR(45) | Nome da categoria |
| descricao | TEXT | Descrição da categoria |

Exemplos de categorias: Eletrônicos, Documentos, Acessórios, Material escolar e Outros.

**Relacionamento:**

Uma categoria pode estar associada a vários objetos, enquanto cada objeto pertence a uma categoria.

Cardinalidade: **1:N**.

### 3. Tabela `locais`

Armazena os locais do campus relacionados aos objetos perdidos e encontrados.

| Campo | Tipo | Descrição |
|---|---|---|
| id_local | INT | Chave primária |
| nome | VARCHAR(45) | Nome do local |
| bloco | VARCHAR(45) | Bloco do campus |
| descricao | TEXT | Informações adicionais |

Os locais poderão representar pontos de ocorrência ou setores de Achados e Perdidos, conforme a organização adotada pelo sistema.

**Relacionamento:**

Um local pode estar associado a vários objetos, enquanto cada objeto possui um local relacionado ao registro.

Cardinalidade: **1:N**.

### 4. Tabela `objetos`

Armazena os objetos perdidos e encontrados registrados pelos usuários.

| Campo | Tipo | Descrição |
|---|---|---|
| id_objeto | INT | Chave primária |
| titulo | VARCHAR(45) | Nome do objeto |
| descricao | TEXT | Descrição do objeto |
| cor | VARCHAR(45) | Cor do objeto |
| tipo | VARCHAR(45) | Perdido ou encontrado |
| status | VARCHAR(45) | Pendente ou devolvido |
| data_ocorrencia | DATE | Data da ocorrência |
| id_usuario | INT | FK para usuarios |
| id_categoria | INT | FK para categorias |
| id_local | INT | FK para locais |

**Relacionamentos:**

- Cada objeto está associado ao usuário responsável pelo cadastro.
- Cada objeto pertence a uma categoria.
- Cada objeto possui um local relacionado à ocorrência ou ao armazenamento.

O campo `status` terá como valor inicial `pendente` e poderá ser atualizado para `devolvido` quando a recuperação do objeto for confirmada.

## Relacionamentos entre as tabelas

O banco de dados possui três relacionamentos do tipo um para muitos (1:N):

1. `usuarios` (1:N) `objetos`
2. `categorias` (1:N) `objetos`
3. `locais` (1:N) `objetos`

Os relacionamentos serão implementados utilizando chaves primárias (PK) e chaves estrangeiras (FK), garantindo a integridade dos dados.

## Utilização de JOIN

A operação `JOIN` permitirá consultar informações de diferentes tabelas em uma única consulta SQL.

No Achei no Campus, será utilizada para apresentar os objetos cadastrados juntamente com o nome do usuário responsável, sua categoria e o local relacionado ao registro.

Também será possível consultar o tipo e o status do objeto, identificando se ele foi perdido ou encontrado e se sua situação está pendente ou concluída.

## Atualização do status dos objetos

O acompanhamento da recuperação será realizado diretamente na tabela `objetos`.

Quando um objeto for cadastrado, receberá inicialmente o status `pendente`.

Após a confirmação de que foi devolvido ao proprietário, o sistema atualizará o status para `devolvido`.

Essa alteração permitirá manter um histórico dos objetos cadastrados, diferenciando aqueles que ainda precisam ser recuperados dos que já foram devolvidos.

## Integração com a aplicação

A comunicação seguirá a estrutura:

**Front-end → API Express → PostgreSQL (Supabase)**

O front-end enviará requisições HTTP para o back-end, responsável por cadastrar objetos, consultar registros, aplicar filtros e atualizar a situação dos objetos no banco de dados.

A atualização do status deverá ser realizada por usuários autorizados, após a confirmação da devolução.

## Situação do desenvolvimento

A estrutura do banco de dados foi revisada conforme as orientações do professor.

A tabela `solicitacoes` foi retirada do modelo proposto, e a tabela `objetos` passou a incluir o campo `status`.

O banco de dados contará com quatro tabelas relacionadas, mantendo o uso de chaves primárias, chaves estrangeiras e consultas com JOIN.

As próximas etapas incluem atualizar o esquema SQL, aplicar as alterações no Supabase e integrar o banco de dados ao back-end da aplicação.
