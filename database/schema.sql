BEGIN;

CREATE TABLE usuarios (
    id_usuarios INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(45),
    senha VARCHAR(255),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email VARCHAR(45)
);

CREATE TABLE categorias (
    id_categoria INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(45),
    descricao TEXT
);

CREATE TABLE locais (
    id_local INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(45),
    bloco VARCHAR(45),
    descricao TEXT
);

CREATE TABLE objetos (
    id_objeto INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(45),
    descricao TEXT,
    cor VARCHAR(45),
    tipo VARCHAR(45) NOT NULL,
    status VARCHAR(45) NOT NULL DEFAULT 'pendente',
    data_ocorrencia DATE,
    id_usuario INT NOT NULL,
    id_categoria INT NOT NULL,
    id_local INT NOT NULL,
    foto_chave TEXT,

    CONSTRAINT ck_objeto_tipo
        CHECK (tipo IN ('perdido', 'encontrado')),
    CONSTRAINT ck_objeto_status
        CHECK (status IN ('pendente', 'devolvido')),
    CONSTRAINT fk_objeto_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuarios),
    CONSTRAINT fk_objeto_categoria
        FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria),
    CONSTRAINT fk_objeto_local
        FOREIGN KEY (id_local) REFERENCES locais (id_local)
);

CREATE VIEW vw_objetos_detalhados AS
SELECT
    o.id_objeto,
    o.titulo,
    o.descricao,
    o.cor,
    o.tipo,
    o.status,
    o.data_ocorrencia,
    u.nome AS usuario,
    c.nome AS categoria,
    l.nome AS local,
    l.bloco
FROM objetos AS o
INNER JOIN usuarios AS u ON o.id_usuario = u.id_usuarios
INNER JOIN categorias AS c ON o.id_categoria = c.id_categoria
INNER JOIN locais AS l ON o.id_local = l.id_local;

COMMIT;

-- Consulta de exemplo:
-- SELECT * FROM vw_objetos_detalhados;
