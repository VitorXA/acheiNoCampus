import { Router } from 'express';
import { cadastrar, consultarSessao, entrar, sair } from '../controllers/auth.controller.js';
import { limitarRequisicoes } from '../middlewares/limite.middleware.js';

const router = Router();
router.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
router.post('/register', limitarRequisicoes('cadastro', 5, 3600), cadastrar);
router.post('/login', limitarRequisicoes('login', 12, 900), entrar);
router.get('/session', consultarSessao);
router.post('/logout', limitarRequisicoes('logout', 30, 900), sair);

export default router;
