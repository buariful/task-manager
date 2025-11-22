import { Router } from 'express';
import { createProject, getProjects } from './project.controller';
import { authenticateJWT } from '../../core/middleware/auth';
import { catchAsync } from '../../utils/catchAync';

const router = Router();

router.use(authenticateJWT);

router.post('/', catchAsync(createProject));
router.get('/', catchAsync(getProjects));

export const ProjectRoutes = router;
