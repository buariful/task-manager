import { Request, Response } from 'express';

const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API not found',
    errorMessage: 'API not found',
  });
};
export default notFound;
