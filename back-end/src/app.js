import cors from 'cors';
import express from 'express';
import { fileURLToPath } from 'node:url';

import { tratarErro } from './middlewares/error.middleware.js';
import categoriasRoutes from './routes/categorias.routes.js';
import locaisRoutes from './routes/locais.routes.js';
import objetosRoutes from './routes/objetos.routes.js';

const app = express();

app.disable('x-powered-by');

if (process.env.FRONTEND_URL) {
  app.use(cors({ origin: process.env.FRONTEND_URL }));
}

app.use(express.json());

app.get('/api/saude', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/categorias', categoriasRoutes);
app.use('/api/locais', locaisRoutes);
app.use('/api/objetos', objetosRoutes);

app.use(express.static(fileURLToPath(new URL('../../front-end/', import.meta.url))));

app.use((_req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada.' });
});

app.use(tratarErro);

export default app;
