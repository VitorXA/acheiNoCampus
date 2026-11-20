import { buscarPorEmail, cadastrarUsuario } from '../repositories/usuarios.repository.js';
import { COOKIE_SESSAO, criarSessao, DURACAO_SESSAO, gerarHash, OPCOES_COOKIE, revogarSessao, senhaCorreta, verificarSessao } from '../services/auth.service.js';
import { lerCookieSessao } from '../middlewares/auth.middleware.js';

function credenciais(body) {
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const senha = body?.senha;
  if (!/^[^\s@\x00]+@[^\s@\x00]+\.[^\s@\x00]+$/.test(email) || email.length > 45
    || typeof senha !== 'string' || senha.length > 128 || !senha.length) return null;
  return { email, senha };
}

async function iniciarSessao(req, res, usuario, status = 200) {
  const { id_usuarios, nome, email } = usuario;
  await revogarSessao(lerCookieSessao(req));
  res.cookie(COOKIE_SESSAO, await criarSessao(id_usuarios), {
    ...OPCOES_COOKIE,
    maxAge: DURACAO_SESSAO * 1000
  });
  return res.status(status).json({ id_usuarios, nome, email });
}

export async function cadastrar(req, res) {
  const entrada = credenciais(req.body);
  const nome = typeof req.body?.nome === 'string' ? req.body.nome.trim() : '';
  if (!entrada || entrada.senha.length < 8 || !nome || nome.length > 45 || nome.includes('\0')) {
    return res.status(400).json({ mensagem: 'Informe nome e e-mail de até 45 caracteres e uma senha de 8 a 128 caracteres.' });
  }
  const usuario = await cadastrarUsuario(nome, entrada.email, await gerarHash(entrada.senha));
  if (!usuario) return res.status(409).json({ mensagem: 'Já existe uma conta com esse e-mail.' });
  return iniciarSessao(req, res, usuario, 201);
}

export async function entrar(req, res) {
  const entrada = credenciais(req.body);
  if (!entrada) return res.status(400).json({ mensagem: 'Informe um e-mail válido e sua senha.' });
  const usuario = await buscarPorEmail(entrada.email);
  if (!(await senhaCorreta(entrada.senha, usuario?.senha))) {
    return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
  }
  return iniciarSessao(req, res, usuario);
}

export async function consultarSessao(req, res) {
  const autenticado = (await verificarSessao(lerCookieSessao(req))) !== null;
  return res.json({ autenticado });
}

export async function sair(req, res) {
  await revogarSessao(lerCookieSessao(req));
  res.clearCookie(COOKIE_SESSAO, OPCOES_COOKIE);
  return res.status(204).end();
}
