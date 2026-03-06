import { Response } from "express";

export const success = (
  res: Response,
  statusCode: number,
  data: unknown
) => {
  return res.status(statusCode).json({
    data
  });
};