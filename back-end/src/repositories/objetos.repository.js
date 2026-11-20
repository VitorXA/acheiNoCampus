import { obterPool } from '../config/database.js';

export async function inserirObjeto({ titulo, descricao, cor, tipo, data, idUsuario, idCategoria, idLocal }, fotoChave = null) {
  const { rows } = await obterPool().query(`
    INSERT INTO public.objetos (titulo, descricao, cor, tipo, data_ocorrencia, id_usuario, id_categoria, id_local, foto_chave)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id_objeto, status
  `, [titulo, descricao, cor, tipo, data, idUsuario, idCategoria, idLocal, fotoChave]);
  return rows[0];
}

const consultaObjetos = `
  SELECT o.id_objeto, o.titulo, o.descricao, o.cor, o.tipo, o.status, o.foto_chave,
         to_char(o.data_ocorrencia, 'YYYY-MM-DD') AS data_ocorrencia,
         o.id_categoria, c.nome AS categoria, o.id_local, l.nome AS local, l.bloco
  FROM public.objetos AS o
  JOIN public.categorias AS c ON c.id_categoria = o.id_categoria
  JOIN public.locais AS l ON l.id_local = o.id_local
`;

export async function listarObjetos({ busca, tipo, status, idCategoria, idLocal, limite, deslocamento }) {
  const { rows } = await obterPool().query(`
    ${consultaObjetos}
    WHERE ($1::text IS NULL OR strpos(
      translate(lower(concat_ws(' ', o.titulo, o.descricao, o.cor, c.nome, l.nome, l.bloco)),
                'áàâãäéêëíïóôõöúüç', 'aaaaaeeeiioooouuc'),
      $1
    ) > 0)
    AND ($2::text IS NULL OR o.tipo = $2)
    AND ($3::text IS NULL OR o.status = $3)
    AND ($4::int IS NULL OR o.id_categoria = $4)
    AND ($5::int IS NULL OR o.id_local = $5)
    ORDER BY o.data_ocorrencia DESC NULLS LAST, o.id_objeto DESC
    LIMIT $6 OFFSET $7
  `, [busca, tipo, status, idCategoria, idLocal, limite, deslocamento]);

  return rows;
}

export async function buscarObjeto(id) {
  const { rows } = await obterPool().query(`
    ${consultaObjetos}
    WHERE o.id_objeto = $1
  `, [id]);

  return rows[0] ?? null;
}
