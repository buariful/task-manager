import { Router } from 'express';
import {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
} from './team.controller';
import { authenticateJWT } from '../../core/middleware/auth';

const router = Router();

// All routes are protected
router.use(authenticateJWT);

router.post('/', createTeam);
router.get('/', getTeams);
router.get('/:teamId', getTeamById);
router.put('/:teamId', updateTeam);
router.delete('/:teamId', deleteTeam);

export const TeamRoutes = router;
