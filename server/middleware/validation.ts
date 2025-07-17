import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createAppError } from './errorHandler';

export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        next(createAppError(`Validation failed: ${message}`, 400));
      } else {
        next(error);
      }
    }
  };
}

export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        next(createAppError(`Query validation failed: ${message}`, 400));
      } else {
        next(error);
      }
    }
  };
}

export function validateParams<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        next(createAppError(`Parameter validation failed: ${message}`, 400));
      } else {
        next(error);
      }
    }
  };
}

// Common validation schemas
export const idParamSchema = z.object({
  id: z.string().transform(Number).refine(n => n > 0, 'ID must be a positive number'),
});

export const paginationSchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const searchSchema = z.object({
  q: z.string().min(1).optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  department: z.string().optional(),
});