import { Response, RequestHandler } from 'express';
import { ProjectModel } from './project.model';
import { returnErrorResponse, returnSuccessResponse } from '../../utils/utils';
import { AuthRequest } from '../../core/middleware/auth.interface';

export const createProject: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  const { name, teamId } = req.body;
  const createdBy = req.user?.id;

  if (!name || !teamId) {
    return returnErrorResponse({
      res,
      status: 400,
      message: 'Name and Team ID are required',
    });
  }

  const project = await ProjectModel.create({ name, teamId, createdBy });

  return returnSuccessResponse({
    res,
    status: 201,
    message: 'Project created successfully',
    data: project,
  });
};

export const getProjects: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  const createdBy = req.user?.id;
  // Optionally filter by createdBy or team membership
  // For now, let's return all projects created by the user
  const projects = await ProjectModel.find({ createdBy });

  return returnSuccessResponse({
    res,
    status: 200,
    data: projects,
  });
};
