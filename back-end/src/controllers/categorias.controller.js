import { buscarCategoria, listarCategorias } from '../repositories/categorias.repository.js';
import { inteiroPositivo } from '../utils/validators.js';

export async function listar(_req, res) {
  return res.json(await listarCategorias());
}

export async function detalhar(req, res) {
  const id = inteiroPositivo(req.params.id);
  if (id === null) return res.status(400).json({ mensagem: 'ID de categoria inválido.' });

  const registro = await buscarCategoria(id);
  if (!registro) return res.status(404).json({ mensagem: 'Categoria não encontrada.' });
  return res.json(registro);
}
