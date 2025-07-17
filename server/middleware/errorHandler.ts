import { Request, Response, NextFunction } from 'express';
import { log } from '../vite';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function createAppError(message: string, statusCode: number = 500): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

export function handleValidationError(error: any): AppError {
  if (error.name === 'ZodError') {
    const message = error.errors.map((err: any) => err.message).join(', ');
    return createAppError(`Validation failed: ${message}`, 400);
  }
  return error;
}

export function globalErrorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Default error values
  let { statusCode = 500, message = 'Internal Server Error' } = err;

  // Handle specific error types
  if (err.name === 'ZodError') {
    const validationError = handleValidationError(err);
    statusCode = validationError.statusCode!;
    message = validationError.message;
  }

  // Log error for debugging
  if (statusCode >= 500) {
    log(`ERROR: ${req.method} ${req.path} - ${message}`, 'error');
    console.error(err.stack);
  } else {
    log(`WARNING: ${req.method} ${req.path} - ${message}`, 'warn');
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && statusCode >= 500) {
    message = 'Internal Server Error';
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
  });
}

export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}