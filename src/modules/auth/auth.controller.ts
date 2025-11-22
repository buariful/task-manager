import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../user/user.model';
import { registerSchema, loginSchema } from './auth.validator';
import config from '../../app/config';
import { returnErrorResponse, returnSuccessResponse } from '../../utils/utils';
import { AuthRequest } from '../../core/middleware/auth.interface';

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({ message: 'Validation failed', errors: parsed.error.errors });

    const { username, email, password, fullName } = parsed.data;

    // Check if user exists
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser)
      return returnErrorResponse({
        res,
        status: 400,
        message: 'Username or email already exists',
      });

    const newUser = new UserModel({ username, email, password, fullName });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, email: newUser.email },
      config.jwt_secret as string,
      { expiresIn: '7d' },
    );

    return returnSuccessResponse({
      res,
      status: 201,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      },
    });
  } catch (err) {
    return returnErrorResponse({ res, status: 500, message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success)
      return returnErrorResponse({
        res,
        status: 400,
        message: 'Validation failed',
      });

    const { username, password } = parsed.data;

    // const user = await UserModel.findByUsername(username);
    const user = await UserModel.findByUsername(username);
    if (!user)
      return returnErrorResponse({
        res,
        status: 404,
        message: 'User not found',
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return returnErrorResponse({
        res,
        status: 400,
        message: 'Invalid password',
      });

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      config.jwt_secret as string,
      { expiresIn: '7d' },
    );

    return returnSuccessResponse({
      res,
      status: 200,
      message: 'User logged in successfully',
      data: {
        token,
        user: { id: user._id, username: user.username, email: user.email },
      },
    });
  } catch (err) {
    return returnErrorResponse({ res, status: 500, message: 'Server error' });
  }
};

export const check = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  const user = await UserModel.findById(userId);
  if (!user) {
    return returnErrorResponse({
      res,
      status: 404,
      message: 'User not found',
    });
  }

  return returnSuccessResponse({
    res,
    status: 200,
    message: 'Token is valid',
    data: {
      user: { id: user._id, username: user.username, email: user.email },
    },
  });
};
