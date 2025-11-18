import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAync';
import { returnErrorResponse, returnSuccessResponse } from '../../utils/utils';
import { AuthRequest } from '../../core/middleware/auth.interface';
import { TeamModel } from './team.model';

// Create a team
export const createTeam = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { name, members } = req.body;
    const createdBy = req.user?._id; // assuming Auth middleware sets req.user

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
  },
);

// Get all teams of a user
export const getTeams = catchAsync(async (req: AuthRequest, res: Response) => {
  const createdBy = req.user?._id;

  const teams = await TeamModel.find({ createdBy });
  return returnSuccessResponse({ res, data: teams });
});

// Get single team by ID
export const getTeamById = catchAsync(async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const team = await TeamModel.findById(teamId);
  if (!team)
    return returnErrorResponse({ res, status: 404, message: 'Team not found' });

  return returnSuccessResponse({ res, data: team });
});

// Update team
export const updateTeam = catchAsync(async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const { name, members } = req.body;

  const team = await TeamModel.findById(teamId);
  if (!team)
    return returnErrorResponse({ res, status: 404, message: 'Team not found' });

  if (name) team.name = name;
  if (members) team.members = members;

  await team.save();
  return returnSuccessResponse({
    res,
    message: 'Team updated successfully',
    data: team,
  });
});

// Delete team
export const deleteTeam = catchAsync(async (req: Request, res: Response) => {
  const { teamId } = req.params;

  const team = await TeamModel.findById(teamId);
  if (!team)
    return returnErrorResponse({ res, status: 404, message: 'Team not found' });

  await team.deleteOne();
  return returnSuccessResponse({ res, message: 'Team deleted successfully' });
});
