import { Request, Response } from 'express';
import { MemberModel } from './member.schema';
import { createMemberSchema } from './member.validator';
import { catchAsync } from '../../utils/catchAync';
import { returnErrorResponse, returnSuccessResponse } from '../../utils/utils';
import { Types } from 'mongoose';

export const createMember = catchAsync(async (req: Request, res: Response) => {
  const parsed = createMemberSchema.safeParse(req.body);
  if (!parsed.success) {
    return returnErrorResponse({
      res,
      status: 400,
      message: 'Validation failed',
    });
  }

  const { userId, teamId, role, capacity } = parsed.data;

  const userObjectId = new Types.ObjectId(userId);
  const teamObjectId = new Types.ObjectId(teamId);

  const exists = await MemberModel.findByUserAndTeam(
    userObjectId,
    teamObjectId,
  );
  if (exists)
    return returnErrorResponse({
      res,
      status: 400,
      message: 'This user is already a member of the team',
    });

  const member = await MemberModel.create({
    userId,
    teamId,
    role,
    capacity,
  });

  return returnSuccessResponse({
    res,
    data: member,
    message: 'Member added successfully',
  });
});

export const getMembersByTeam = catchAsync(
  async (req: Request, res: Response) => {
    const { teamId } = req.params;

    const members = await MemberModel.find({ teamId }).populate('userId');

    return returnSuccessResponse({
      res,
      data: members,
    });
  },
);
