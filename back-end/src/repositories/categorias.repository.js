import { obterPool } from '../config/database.js';

export async function listarCategorias() {
  const { rows } = await obterPool().query(`
    SELECT id_categoria, nome, descricao
    FROM public.categorias
    ORDER BY nome, id_categoria
  `);
  return rows;
}

export async function buscarCategoria(id) {
  const { rows } = await obterPool().query(`
    SELECT id_categoria, nome, descricao
    FROM public.categorias
    WHERE id_categoria = $1
  `, [id]);
  return rows[0] ?? null;
}
