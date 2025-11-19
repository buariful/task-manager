// /* eslint-disable no-unused-vars */
// import { Request, Response, NextFunction } from 'express';

// type AsyncController<Req = Request, Res = Response> = (
//   req: Req,
//   res: Res,
//   next: NextFunction,
// ) => Promise<void>;

// export const catchAsync = <Req = Request, Res = Response>(
//   fn: AsyncController<Req, Res>,
// ) => {
//   return (req: Req, res: Res, next: NextFunction) => {
//     fn(req, res, next).catch(next);
//   };
// };

import { NextFunction, Request, RequestHandler, Response } from 'express';

export const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

// export default catchAsync;
