import cors from 'cors';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { cabecalhosSeguranca } from './config/cabecalhos.js';

import { tratarErro } from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import categoriasRoutes from './routes/categorias.routes.js';
import locaisRoutes from './routes/locais.routes.js';
import objetosRoutes from './routes/objetos.routes.js';

const app = express();

app.disable('x-powered-by');
const producao = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
app.use((_req, res, next) => {
  res.set(cabecalhosSeguranca(producao));
  next();
});

if (process.env.FRONTEND_URL) {
  app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
}

app.use('/api', (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method) || req.get('X-Achei-Request') === '1') return next();
  return res.status(403).json({ mensagem: 'Requisição de escrita não autorizada.' });
});
app.use(express.json({ limit: '16kb' }));

app.get('/api/saude', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/categorias', categoriasRoutes);
app.use('/api/locais', locaisRoutes);
app.use('/api/objetos', objetosRoutes);
app.use('/api/auth', authRoutes);

app.use(express.static(fileURLToPath(new URL('../../front-end/', import.meta.url))));

app.get('/', (_req, res) => res.redirect('/index.html'));

app.use((_req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada.' });
});

app.use(tratarErro);

export default app;
