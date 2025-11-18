import { Router } from 'express';
import { getMe, updateMe, changePassword } from './user.controller';
import { authenticateJWT } from '../../core/middleware/auth';

const router = Router();

router.get('/me', authenticateJWT, getMe);
router.patch('/me', authenticateJWT, updateMe);
router.patch('/me/password', authenticateJWT, changePassword);

export const UserRoutes = router;
