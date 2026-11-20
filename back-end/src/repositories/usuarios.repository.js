import { obterPool } from '../config/database.js';

export async function cadastrarUsuario(nome, email, hash) {
  const { rows } = await obterPool().query(`
    INSERT INTO public.usuarios (nome, email, senha)
    VALUES ($1, $2, $3)
    ON CONFLICT (lower(email)) DO NOTHING
    RETURNING id_usuarios, nome, email
  `, [nome, email, hash]);
  return rows[0];
}

export async function buscarPorEmail(email) {
  const { rows } = await obterPool().query(`
    SELECT id_usuarios, nome, email, senha
    FROM public.usuarios WHERE lower(email) = $1 LIMIT 2
  `, [email]);
  return rows.length === 1 ? rows[0] : null;
}
