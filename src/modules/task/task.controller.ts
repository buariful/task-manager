import { Response, RequestHandler } from 'express';
import { TaskModel } from './task.model';
import { returnErrorResponse, returnSuccessResponse } from '../../utils/utils';
import { AuthRequest } from '../../core/middleware/auth.interface';

export const createTask: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  const { title, description, projectId, assignedTo, priority, status } =
    req.body;
  const createdBy = req.user?.id;

  if (!title || !description || !projectId || !priority) {
    return returnErrorResponse({
      res,
      status: 400,
      message: 'Title, description, projectId, and priority are required',
    });
  }

  const task = await TaskModel.create({
    title,
    description,
    projectId,
    assignedTo,
    priority,
    status: status || 'Pending',
    createdBy,
  });

  return returnSuccessResponse({
    res,
    status: 201,
    message: 'Task created successfully',
    data: task,
  });
};

export const getTasks: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  const { projectId } = req.query;
  const createdBy = req.user?.id;

  const filter: any = { createdBy };
  if (projectId) {
    filter.projectId = projectId;
  }

  const tasks = await TaskModel.find(filter).populate('assignedTo');

  return returnSuccessResponse({
    res,
    status: 200,
    data: tasks,
  });
};

export const updateTask: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  const { taskId } = req.params;
  const updateData = req.body;

  const task = await TaskModel.findByIdAndUpdate(taskId, updateData, {
    new: true,
  });

  if (!task) {
    return returnErrorResponse({
      res,
      status: 404,
      message: 'Task not found',
    });
  }

  return returnSuccessResponse({
    res,
    status: 200,
    message: 'Task updated successfully',
    data: task,
  });
};

export const deleteTask: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  const { taskId } = req.params;

  const task = await TaskModel.findByIdAndDelete(taskId);

  if (!task) {
    return returnErrorResponse({
      res,
      status: 404,
      message: 'Task not found',
    });
  }

  return returnSuccessResponse({
    res,
    status: 200,
    message: 'Task deleted successfully',
  });
};

export const autoReassignTasks: RequestHandler = async (
  req: AuthRequest,
  res: Response,
) => {
  const userId = req.user?.id;

  // Find teams created by the user
  const teams = await import('../team/team.model').then((m) =>
    m.TeamModel.find({ createdBy: userId }),
  );
  const ProjectModel = await import('../project/project.model').then(
    (m) => m.ProjectModel,
  );

  let totalMoved = 0;

  for (const team of teams) {
    // Get projects for this team
    const projects = await ProjectModel.find({ teamId: team._id });
    const projectIds = projects.map((p) => p._id);

    // Get tasks for these projects, excluding 'Done'
    const tasks = await TaskModel.find({
      projectId: { $in: projectIds },
      status: { $ne: 'Done' },
    });

    // Calculate load
    const memberLoad: Record<string, number> = {};
    const tasksByMember: Record<string, any[]> = {};

    // Initialize load for all members
    const members = (team.members as any) || [];
    members.forEach((m: any) => {
      const memberId = m._id.toString();
      memberLoad[memberId] = 0;
      tasksByMember[memberId] = [];
    });

    // Distribute tasks to calculate current load
    tasks.forEach((task) => {
      if (task.assignedTo) {
        const memberId = task.assignedTo.toString();
        if (memberLoad[memberId] !== undefined) {
          memberLoad[memberId]++;
          tasksByMember[memberId].push(task);
        }
      }
    });

    // Identify overloaded and underloaded
    const overloaded: any[] = [];
    const underloaded: any[] = [];

    members.forEach((m: any) => {
      const id = m._id.toString();
      const load = memberLoad[id];
      const capacity = m.capacity;

      if (load > capacity) {
        overloaded.push({
          id,
          member: m,
          load,
          capacity,
          excess: load - capacity,
        });
      } else if (load < capacity) {
        underloaded.push({
          id,
          member: m,
          load,
          capacity,
          available: capacity - load,
        });
      }
    });

    // Reassign
    for (const source of overloaded) {
      while (source.excess > 0 && underloaded.length > 0) {
        // Get a target member
        const target = underloaded[0]; // Simple strategy: fill first available

        // Move one task
        const taskToMove = tasksByMember[source.id].pop(); // Take last task
        if (taskToMove) {
          taskToMove.assignedTo = target.id;
          await taskToMove.save();

          source.excess--;
          source.load--;
          target.available--;
          target.load++;
          totalMoved++;

          if (target.available === 0) {
            underloaded.shift(); // Remove if full
          }
        } else {
          break;
        }
      }
    }
  }

  return returnSuccessResponse({
    res,
    status: 200,
    message: `Successfully reassigned ${totalMoved} tasks.`,
    data: { moved: totalMoved },
  });
};
