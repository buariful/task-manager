import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { UserRoutes } from './modules/user/user.route';
import { AuthRoutes } from './modules/auth/auth.routes';
import { TeamRoutes } from './modules/team/team.routes';
import { MemberRoute } from './modules/member/member.route';
import { ProjectRoutes } from './modules/project/project.routes';
import { TaskRoutes } from './modules/task/task.routes';
import globalErrorMiddleware from './core/middleware/globalMiddleware';
import notFound from './core/middleware/notFound';
const app: Application = express();

// parser
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/users', UserRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/team', TeamRoutes);
app.use('/api/memeber', MemberRoute);
app.use('/api/project', ProjectRoutes);
app.use('/api/task', TaskRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running smoothly...' });
});

app.use(globalErrorMiddleware);
app.use(notFound);

export default app;
