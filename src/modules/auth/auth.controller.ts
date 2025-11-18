import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../user/user.model';
import { registerSchema, loginSchema } from './auth.validator';

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
      return res
        .status(400)
        .json({ message: 'Username or email already exists' });

    const newUser = new UserModel({ username, email, password, fullName });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({ message: 'Validation failed', errors: parsed.error.errors });

    const { username, password } = parsed.data;

    // const user = await UserModel.findByUsername(username);
    const user = await UserModel.findByUsername(username);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' },
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
