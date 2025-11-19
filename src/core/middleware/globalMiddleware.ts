/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';

const globalErrorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  const errorMessage = '';

  res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails: err,
  });
};

export default globalErrorMiddleware;
