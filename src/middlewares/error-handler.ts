import { Request, Response, NextFunction } from "express"
import { AppError } from "../errors/app-error"
import { HTTP_STATUS } from "../config/http-status"

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message
    })
  }

  console.error(err)

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error"
  })
}