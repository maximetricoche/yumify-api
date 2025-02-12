import { NextFunction, Request, Response } from "express";
import { STATUS } from "../utils/httpStatus";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
};
