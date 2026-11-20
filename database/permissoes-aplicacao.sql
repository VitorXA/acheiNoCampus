GRANT USAGE ON SCHEMA public TO achei_app;
GRANT SELECT, INSERT ON public.usuarios, public.objetos, public.sessoes TO achei_app;
GRANT USAGE ON SEQUENCE public.usuarios_id_usuarios_seq, public.objetos_id_objeto_seq TO achei_app;
GRANT DELETE ON public.sessoes TO achei_app;
GRANT SELECT ON public.categorias, public.locais TO achei_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.limites_api TO achei_app;

CREATE POLICY app_usuarios_leitura ON public.usuarios FOR SELECT TO achei_app USING (true);
CREATE POLICY app_usuarios_cadastro ON public.usuarios FOR INSERT TO achei_app WITH CHECK (true);
CREATE POLICY app_objetos_leitura ON public.objetos FOR SELECT TO achei_app USING (true);
CREATE POLICY app_objetos_cadastro ON public.objetos FOR INSERT TO achei_app WITH CHECK (true);
CREATE POLICY app_categorias_leitura ON public.categorias FOR SELECT TO achei_app USING (true);
CREATE POLICY app_locais_leitura ON public.locais FOR SELECT TO achei_app USING (true);
CREATE POLICY app_sessoes ON public.sessoes TO achei_app USING (true) WITH CHECK (true);
CREATE POLICY app_limites ON public.limites_api TO achei_app USING (true) WITH CHECK (true);
