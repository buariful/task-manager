import { Router } from 'express';
import {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  createTeamWithMembers,
} from './team.controller';
import { authenticateJWT } from '../../core/middleware/auth';
import { catchAsync } from '../../utils/catchAync';

const router = Router();

// All routes are protected
router.use(authenticateJWT);

router.post('/', createTeam);
router.get('/', getTeams);
router.get('/:teamId', getTeamById);
router.put('/:teamId', updateTeam);
router.delete('/:teamId', deleteTeam);
// router.post('/create-with-members', catchAsync(createTeamWithMembers));
router.post('/create-with-members', catchAsync(createTeamWithMembers));

export const TeamRoutes = router;
