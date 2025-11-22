import { Request, RequestHandler, Response } from 'express';
import { catchAsync } from '../../utils/catchAync';
import { returnErrorResponse, returnSuccessResponse } from '../../utils/utils';
import { AuthRequest } from '../../core/middleware/auth.interface';
import { TeamModel } from './team.model';
import { MemberModel } from '../member/member.schema';

// Create a team
export const createTeam: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  const { name, members } = req.body;
  const createdBy = req.user?.id; // assuming Auth middleware sets req.user

  if (!name)
    return returnErrorResponse({
      res,
      status: 400,
      message: 'Team name is required',
    });

  const team = new TeamModel({ name, members, createdBy });
  await team.save();

  return returnSuccessResponse({
    res,
    status: 201,
    message: 'Team created successfully',
    data: team,
  });
};

// Get all teams created by an user
export const getTeams: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  const createdBy = req.user?.id;

  const teams = await TeamModel.find({ createdBy });
  return returnSuccessResponse({ res, data: teams });
};

// Get single team by ID
export const getTeamById: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const { teamId } = req.params;
  const team = await TeamModel.findById(teamId);
  if (!team)
    return returnErrorResponse({ res, status: 404, message: 'Team not found' });

  return returnSuccessResponse({ res, data: team });
};

// Update team
export const updateTeam: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const { name } = req.body;

    const team = await TeamModel.findById(teamId);
    if (!team)
      return returnErrorResponse({
        res,
        status: 404,
        message: 'Team not found',
      });

    if (name) team.name = name;
    // if (members) team.members = members;

    await team.save();
    return returnSuccessResponse({
      res,
      message: 'Team updated successfully',
      data: team,
    });
  },
);

// Delete team
export const deleteTeam: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const { teamId } = req.params;

  const team = await TeamModel.findById(teamId);
  if (!team)
    return returnErrorResponse({ res, status: 404, message: 'Team not found' });

  await team.deleteOne();
  return returnSuccessResponse({ res, message: 'Team deleted successfully' });
};

// Add member to team
export const addMember: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const { teamId } = req.params;
  const { name, role, capacity } = req.body;

  const team = await TeamModel.findById(teamId);
  if (!team)
    return returnErrorResponse({ res, status: 404, message: 'Team not found' });

  team.members.push({ name, role, capacity });
  await team.save();

  return returnSuccessResponse({
    res,
    message: 'Member added successfully',
    data: team,
  });
};

export const createTeamWithMembers: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  const { name, memberIds } = req.body;
  const createdBy = req.user?.id;
  if (!name)
    return returnErrorResponse({
      res,
      status: 400,
      message: 'Team name is required',
    });

  const team = await TeamModel.create({ name, createdBy });

  if (Array.isArray(memberIds) && memberIds.length > 0) {
    const membersToCreate = [
      {
        userId: createdBy,
        teamId: team._id,
        role: 'admin',
        capacity: 5,
      },
    ];

    memberIds.map((userId: string) =>
      membersToCreate.push({
        userId,
        teamId: team._id,
        role: 'member',
        capacity: 3,
      }),
    );

    await MemberModel.insertMany(membersToCreate);
  }

  return returnSuccessResponse({
    res,
    status: 201,
    message: 'Team and members created successfully',
    data: { teamId: team._id, name: team.name, memberIds },
  });
};
