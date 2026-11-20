BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS usuarios_email_normalizado
    ON public.usuarios (lower(email));

CREATE TABLE IF NOT EXISTS public.sessoes (
    token_hash TEXT PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES public.usuarios (id_usuarios) ON DELETE CASCADE,
    expira_em TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS sessoes_expiracao ON public.sessoes (expira_em);

CREATE TABLE IF NOT EXISTS public.limites_api (
    chave TEXT PRIMARY KEY,
    tentativas INT NOT NULL,
    expira_em TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS limites_api_expiracao ON public.limites_api (expira_em);

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.limites_api ENABLE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES ON TABLE public.usuarios, public.objetos, public.categorias,
    public.locais, public.sessoes, public.limites_api, public.vw_objetos_detalhados
    FROM PUBLIC, anon, authenticated;

COMMIT;
