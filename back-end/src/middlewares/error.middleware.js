export function tratarErro(erro, _req, res, next) {
  if (res.headersSent) {
    return next(erro);
  }

  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ mensagem: 'JSON inválido.' });
  }

  if (erro.type === 'entity.too.large') {
    return res.status(413).json({ mensagem: 'Corpo da requisição muito grande.' });
  }

  console.error(erro);
  return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
}
