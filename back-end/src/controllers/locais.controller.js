import { buscarLocal, listarLocais } from '../repositories/locais.repository.js';
import { inteiroPositivo } from '../utils/validators.js';

export async function listar(_req, res) {
  return res.json(await listarLocais());
}

export async function detalhar(req, res) {
  const id = inteiroPositivo(req.params.id);
  if (id === null) return res.status(400).json({ mensagem: 'ID de local inválido.' });

  const registro = await buscarLocal(id);
  if (!registro) return res.status(404).json({ mensagem: 'Local não encontrado.' });
  return res.json(registro);
}
