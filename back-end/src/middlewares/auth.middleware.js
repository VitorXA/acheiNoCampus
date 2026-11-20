import { COOKIE_SESSAO, verificarSessao } from '../services/auth.service.js';

export function lerCookieSessao(req) {
  const cookies = req.headers.cookie?.split(';') ?? [];
  const token = cookies.map(cookie => cookie.trim()).find(cookie => cookie.startsWith(COOKIE_SESSAO + '='));
  return token?.slice(COOKIE_SESSAO.length + 1);
}

export async function exigirSessao(req, res, next) {
  const id = await verificarSessao(lerCookieSessao(req));
  if (id === null) return res.status(401).json({ mensagem: 'Entre na sua conta para publicar.' });
  req.idUsuario = id;
  return next();
}
