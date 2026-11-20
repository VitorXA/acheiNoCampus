import { createHash, randomBytes, scrypt as derivarSenha, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { buscarSessao, excluirSessao, guardarSessao } from '../repositories/sessoes.repository.js';

const scrypt = promisify(derivarSenha);
const opcoes = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
export const DURACAO_SESSAO = 8 * 60 * 60;
const seguro = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
export const COOKIE_SESSAO = seguro ? '__Host-achei_sessao' : 'achei_sessao';
export const OPCOES_COOKIE = { httpOnly: true, secure: seguro, sameSite: 'lax', path: '/' };

export async function gerarHash(senha) {
  const sal = randomBytes(16).toString('hex');
  const hash = await scrypt(senha, sal, 64, opcoes);
  return 'scrypt:' + sal + ':' + hash.toString('hex');
}

export async function senhaCorreta(senha, credencial) {
  const partes = /^scrypt:([a-f0-9]{32}):([a-f0-9]{128})$/.exec(credencial ?? '');
  const hash = await scrypt(senha, partes?.[1] ?? '0'.repeat(32), 64, opcoes);
  return partes !== null && timingSafeEqual(hash, Buffer.from(partes[2], 'hex'));
}

export function chaveSessao() {
  const chave = process.env.JWT_SECRET;
  if (!chave || chave.length < 32 || chave === 'SUBSTITUA_POR_UMA_CHAVE_SEGURA') {
    throw new Error('Configure JWT_SECRET com ao menos 32 caracteres aleatórios.');
  }
  return chave;
}

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export async function criarSessao(id) {
  const token = randomBytes(32).toString('base64url');
  await guardarSessao(hashToken(token), id, DURACAO_SESSAO);
  return token;
}

export function verificarSessao(token) {
  return /^[A-Za-z0-9_-]{43}$/.test(token ?? '') ? buscarSessao(hashToken(token)) : null;
}

export async function revogarSessao(token) {
  if (/^[A-Za-z0-9_-]{43}$/.test(token ?? '')) await excluirSessao(hashToken(token));
}
