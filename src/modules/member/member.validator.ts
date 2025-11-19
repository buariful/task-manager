import { z } from 'zod';

export const createMemberSchema = z.object({
  userId: z.string(),
  teamId: z.string(),
  role: z.string().min(2),
  capacity: z.number().min(0).max(5),
});
