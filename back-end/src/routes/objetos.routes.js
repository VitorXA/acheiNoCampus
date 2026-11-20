import { Router } from 'express';
import { detalhar, listar } from '../controllers/objetos.controller.js';

const router = Router();

router.get('/', listar);
router.get('/:id', detalhar);

export default router;
