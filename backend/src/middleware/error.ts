import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// Wraps async route handlers so thrown/rejected errors reach the error handler.
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(422).json({
      error: "Validation failed",
      details: err.flatten(),
    });
  }
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  // Prisma "record not found" on update/delete
  if (typeof err === "object" && err && (err as any).code === "P2025") {
    return res.status(404).json({ error: "Record not found" });
  }
  // Unique constraint
  if (typeof err === "object" && err && (err as any).code === "P2002") {
    return res.status(409).json({ error: "A record with that value already exists" });
  }
  console.error("Unhandled error:", err);
  return res.status(500).json({ error: "Internal server error" });
}
