import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';
import { obterPool } from '../config/database.js';
import { chaveSessao } from '../services/auth.service.js';

function identificarCliente(req) {
  const encaminhado = req.get('x-forwarded-for')?.trim();
  if (process.env.VERCEL === '1' && isIP(encaminhado ?? '')) return encaminhado;
  return req.ip;
}

export function limitarRequisicoes(operacao, maximo, segundos, porUsuario = false) {
  return async (req, res, next) => {
    const chave = createHmac('sha256', chaveSessao())
      .update(operacao + ':' + (porUsuario ? req.idUsuario : identificarCliente(req)))
      .digest('hex');
    const { rows } = await obterPool().query(`
      INSERT INTO public.limites_api AS limite (chave, tentativas, expira_em)
      VALUES ($1, 1, now() + $2 * interval '1 second')
      ON CONFLICT (chave) DO UPDATE SET
        tentativas = CASE WHEN limite.expira_em <= now() THEN 1 ELSE LEAST(limite.tentativas + 1, $3 + 1) END,
        expira_em = CASE WHEN limite.expira_em <= now() THEN excluded.expira_em ELSE limite.expira_em END
      RETURNING tentativas, ceil(extract(epoch FROM expira_em - now()))::int AS espera
    `, [chave, segundos, maximo]);
    if (rows[0].tentativas > maximo) {
      return res.set('Retry-After', String(Math.max(1, rows[0].espera))).status(429)
        .json({ mensagem: 'Muitas tentativas. Aguarde e tente novamente.' });
    }
    if (Math.random() < 0.02) {
      await obterPool().query(`
        DELETE FROM public.limites_api WHERE expira_em <= now() AND chave IN (
          SELECT chave FROM public.limites_api WHERE expira_em <= now() LIMIT 100
        )
      `);
      await obterPool().query(`
        DELETE FROM public.sessoes WHERE token_hash IN (
          SELECT token_hash FROM public.sessoes WHERE expira_em <= now() LIMIT 100
        )
      `);
    }
    return next();
  };
}
