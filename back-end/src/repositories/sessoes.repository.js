import { obterPool } from '../config/database.js';

export async function guardarSessao(hash, id, duracao) {
  await obterPool().query(`
    INSERT INTO public.sessoes (token_hash, id_usuario, expira_em)
    VALUES ($1, $2, now() + $3 * interval '1 second')
  `, [hash, id, duracao]);
}

export async function buscarSessao(hash) {
  const { rows } = await obterPool().query(`
    SELECT id_usuario FROM public.sessoes WHERE token_hash = $1 AND expira_em > now()
  `, [hash]);
  return rows[0]?.id_usuario ?? null;
}

export async function excluirSessao(hash) {
  await obterPool().query('DELETE FROM public.sessoes WHERE token_hash = $1', [hash]);
}
