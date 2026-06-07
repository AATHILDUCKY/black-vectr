import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

// Validates & coerces req.body against a Zod schema, replacing body with the
// parsed result. Throws ZodError (caught by the global error handler).
export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
}
