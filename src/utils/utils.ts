/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';

// export const returnSuccessResponse = (
//   res: Response,
//   status: number = 200,
//   message: string = 'Successfull',
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   data: any = {},
// ) => {
//   res.status(status).json({
//     success: true,
//     message: message,
//     data,
//   });
// };

interface SuccessResponseOptions<T = any> {
  res: Response;
  status?: number;
  message?: string;
  data?: T;
}

export const returnSuccessResponse = <T = any>({
  res,
  status = 200,
  message = 'Successful',
  data = {} as T,
}: SuccessResponseOptions<T>) => {
  res.status(status).json({
    success: true,
    message,
    data,
  });
};

// export const returnErrorResponse = (
//   res: Response,
//   status: number = 400,
//   message: string = 'Something went wrong',
// ) => {
//   res.status(status).json({
//     success: false,
//     message: message,
//     error: {
//       code: status,
//       description: message,
//     },
//   });
// };

interface ErrorResponseOptions {
  res: Response;
  status?: number;
  message?: string;
}

export const returnErrorResponse = ({
  res,
  status = 400,
  message = 'Something went wrong',
}: ErrorResponseOptions) => {
  const payload = {
    success: false,
    message,
    error: {
      code: status,
      description: message,
    },
  };

  res.status(status).json(payload);
};
