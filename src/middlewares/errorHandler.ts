import { NextFunction, Request, Response } from "express";
import { STATUS } from "../utils/httpStatus";

export const createError = (statusCode: number, message: string, details?: string) => {
  const error: any = new Error(message);
  error.status = statusCode;
  error.stack = details;
  return error;
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || "Une erreur est survenue";
  const details = err.details || undefined;

  console.error(err);

  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      message,
      details,
      stack: err.stack,
    });
  } else {
    res.status(statusCode).json({
      message,
      details,
    });
  }
};
