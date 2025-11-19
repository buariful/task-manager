import { Request } from 'express';

export interface JWTPayload {
  // _id: string;
  id: string;
  username: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}
