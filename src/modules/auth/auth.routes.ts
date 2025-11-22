import { Router } from 'express';
import { register, login, check } from './auth.controller';
import { authenticateJWT } from '../../core/middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/check', authenticateJWT, check);

export const AuthRoutes = router;
