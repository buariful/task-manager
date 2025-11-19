import { Response } from 'express';
import { UserModel } from './user.model';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../../core/middleware/auth.interface';
import { changePasswordSchema, updateUserSchema } from './user.validator';

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const parseResult = updateUserSchema.safeParse(req.body);
    if (!parseResult.success)
      return res.status(400).json({
        message: 'Validation failed',
        errors: parseResult.error.errors,
      });

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      { ...parseResult.data },
      { new: true },
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const parseResult = changePasswordSchema.safeParse(req.body);
    if (!parseResult.success)
      return res.status(400).json({
        message: 'Validation failed',
        errors: parseResult.error.errors,
      });

    const { oldPassword, newPassword } = parseResult.data;

    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Old password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
