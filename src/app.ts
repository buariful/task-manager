import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { UserRoutes } from './modules/user/user.route';
import { AuthRoutes } from './modules/auth/auth.routes';
import { TeamRoutes } from './modules/team/team.routes';
const app: Application = express();

// parser
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/users', UserRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/team', TeamRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running smoothly...' });
});

export default app;
