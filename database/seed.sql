BEGIN;

LOCK TABLE public.categorias, public.locais IN SHARE ROW EXCLUSIVE MODE;

INSERT INTO public.categorias (nome)
SELECT entrada.nome
FROM (VALUES
    ('Eletrônicos'),
    ('Documentos'),
    ('Acessórios'),
    ('Material escolar'),
    ('Garrafas e marmitas'),
    ('Roupas'),
    ('Outros')
) AS entrada(nome)
WHERE NOT EXISTS (
    SELECT 1 FROM public.categorias AS c WHERE lower(c.nome) = lower(entrada.nome)
);

INSERT INTO public.locais (nome)
SELECT entrada.nome
FROM (VALUES
    ('Biblioteca'),
    ('Achados e Perdidos'),
    ('Auditório'),
    ('Estacionamento'),
    ('Ginásio'),
    ('Laboratório de Informática'),
    ('Refeitório'),
    ('Outro local do campus')
) AS entrada(nome)
WHERE NOT EXISTS (
    SELECT 1 FROM public.locais AS l WHERE lower(l.nome) = lower(entrada.nome)
);

WITH blocos (nome) AS (
    VALUES ('Bloco Central'), ('BDI'), ('BCC'), ('Bloco de Química'), ('Bloco de Mecânica')
)
INSERT INTO public.locais (nome, bloco)
SELECT blocos.nome, blocos.nome
FROM blocos
WHERE NOT EXISTS (
    SELECT 1 FROM public.locais AS l
    WHERE lower(l.nome) = lower(blocos.nome)
      AND lower(l.bloco) = lower(blocos.nome)
);

UPDATE public.locais
SET bloco = 'Bloco Central'
WHERE lower(nome) = 'biblioteca'
  AND NULLIF(btrim(bloco), '') IS NULL;

COMMIT;
