import { obterPool } from '../config/database.js';

export async function listarLocais() {
  const { rows } = await obterPool().query(`
    SELECT id_local, nome, bloco, descricao
    FROM public.locais
    ORDER BY nome, id_local
  `);
  return rows;
}

export async function buscarLocal(id) {
  const { rows } = await obterPool().query(`
    SELECT id_local, nome, bloco, descricao
    FROM public.locais
    WHERE id_local = $1
  `, [id]);
  return rows[0] ?? null;
}
