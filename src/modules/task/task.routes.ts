import { Router } from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  autoReassignTasks,
} from './task.controller';
import { authenticateJWT } from '../../core/middleware/auth';
import { catchAsync } from '../../utils/catchAync';

const router = Router();

router.use(authenticateJWT);

router.post('/', catchAsync(createTask));
router.post('/reassign', catchAsync(autoReassignTasks));
router.get('/', catchAsync(getTasks));
router.put('/:taskId', catchAsync(updateTask));
router.delete('/:taskId', catchAsync(deleteTask));

export const TaskRoutes = router;
