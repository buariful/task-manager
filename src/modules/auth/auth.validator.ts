import { z } from 'zod';

// Register
export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email('Invalid email'),
  fullName: z.object({
    firstName: z.string().min(1, 'First name required'),
    lastName: z.string().optional(),
  }),
});

// Login
export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});
