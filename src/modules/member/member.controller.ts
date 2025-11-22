import { Request, Response } from 'express';
import { MemberModel } from './member.schema';
import { createMemberSchema } from './member.validator';
import { catchAsync } from '../../utils/catchAync';
import { returnErrorResponse, returnSuccessResponse } from '../../utils/utils';

export const createMember = catchAsync(async (req: Request, res: Response) => {
  const parsed = createMemberSchema.safeParse(req.body);
  if (!parsed.success) {
    return returnErrorResponse({
      res,
      status: 400,
      message: 'Validation failed',
    });
  }

  const { teamId, role, capacity } = parsed.data;

  const member = await MemberModel.create({
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
