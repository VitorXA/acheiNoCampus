import { buscarObjeto } from '../repositories/objetos.repository.js';
import { consultarObjetos } from '../services/objetos.service.js';
import { inteiroPositivo } from '../utils/validators.js';

export async function listar(req, res) {
  const resultado = await consultarObjetos(req.query);
  if (resultado.erro) {
    return res.status(400).json({ mensagem: resultado.erro });
  }
  return res.json(resultado);
}

export async function detalhar(req, res) {
  const id = inteiroPositivo(req.params.id);
  if (id === null) return res.status(400).json({ mensagem: 'ID de objeto inválido.' });

  const objeto = await buscarObjeto(id);
  if (!objeto) return res.status(404).json({ mensagem: 'Objeto não encontrado.' });
  return res.json(objeto);
}
