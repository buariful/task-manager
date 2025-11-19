import { Router } from 'express';
import { createMember, getMembersByTeam } from './member.controller';

const router = Router();

router.post('/', createMember);
router.get('/:teamId', getMembersByTeam);

export const MemberRoute = router;
