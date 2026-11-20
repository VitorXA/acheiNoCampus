import { buscarObjeto, inserirObjeto } from '../repositories/objetos.repository.js';
import { consultarObjetos, validarNovaFicha } from '../services/objetos.service.js';
import { inteiroPositivo } from '../utils/validators.js';
import { apresentarFoto, enviarFoto, removerFoto, validarFoto } from '../services/fotos.service.js';

export async function listar(req, res) {
  const resultado = await consultarObjetos(req.query);
  if (resultado.erro) {
    return res.status(400).json({ mensagem: resultado.erro });
  }
  return res.json({ ...resultado, dados: resultado.dados.map(apresentarFoto) });
}

export async function detalhar(req, res) {
  const id = inteiroPositivo(req.params.id);
  if (id === null) return res.status(400).json({ mensagem: 'ID de objeto inválido.' });

  const objeto = await buscarObjeto(id);
  if (!objeto) return res.status(404).json({ mensagem: 'Objeto não encontrado.' });
  return res.json(apresentarFoto(objeto));
}

export async function publicar(req, res) {
  let dados = req.body;
  let arquivo;
  if (req.is('multipart/form-data')) {
    try {
      const mensagem = new Response(req.body, {
        headers: { 'content-type': req.get('content-type') }
      });
      const formulario = await mensagem.formData();
      dados = Object.fromEntries(formulario);
      arquivo = formulario.get('foto');
    } catch {
      return res.status(400).json({ mensagem: 'Não foi possível ler o formulário da ficha.' });
    }
  }

  const ficha = validarNovaFicha(dados, req.idUsuario);
  if (!ficha) return res.status(400).json({ mensagem: 'Confira o título, o tipo, a categoria, o local e a data da ficha.' });

  let fotoChave;
  if (arquivo !== undefined && arquivo !== null) {
    const foto = arquivo instanceof File ? await validarFoto(arquivo) : null;
    if (!foto) return res.status(400).json({ mensagem: 'Envie uma foto JPG ou PNG de até 4 MB.' });
    try {
      fotoChave = await enviarFoto(foto);
    } catch (erro) {
      console.error('Falha ao enviar foto ao Storage:', erro.message);
      return res.status(503).json({ mensagem: 'O envio de fotos está indisponível. Tente novamente ou publique sem foto.' });
    }
  }

  let objeto;
  try {
    objeto = await inserirObjeto(ficha, fotoChave);
  } catch (erro) {
    // Falhas de conexão podem ter ocorrido depois de o banco concluir o INSERT.
    if (fotoChave && /^[A-Z0-9]{5}$/.test(erro.code ?? '') && !erro.code.startsWith('08')) {
      await removerFoto(fotoChave).catch(() => console.error('Falha ao remover foto de ficha rejeitada.'));
    }
    if (erro.code === '23503') {
      return res.status(409).json({ mensagem: 'O usuário, a categoria ou o local selecionado deixou de existir.' });
    }
    throw erro;
  }
  return res.location('/api/objetos/' + objeto.id_objeto).status(201)
    .json(apresentarFoto({ ...objeto, foto_chave: fotoChave }));
}
