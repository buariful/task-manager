import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JWTPayload } from './auth.interface';
import config from '../../app/config';

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const payload = jwt.verify(
      token,
      config.jwt_secret as string,
    ) as JWTPayload;

    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden' });
  }
};
