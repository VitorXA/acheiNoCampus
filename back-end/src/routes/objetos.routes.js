import { raw, Router } from 'express';
import { detalhar, listar, publicar } from '../controllers/objetos.controller.js';
import { exigirSessao } from '../middlewares/auth.middleware.js';
import { limitarRequisicoes } from '../middlewares/limite.middleware.js';

const router = Router();

router.get('/', listar);
router.post('/', exigirSessao, limitarRequisicoes('publicar', 12, 3600, true),
  raw({ type: 'multipart/form-data', limit: 4 * 1024 * 1024 + 32 * 1024 }), publicar);
router.get('/:id', detalhar);

export default router;
