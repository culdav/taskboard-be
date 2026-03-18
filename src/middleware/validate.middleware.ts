import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../utils/errors';

type ValidationSchema = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

function formatValidationError(
  prefix: string,
  issues: Array<{ path: PropertyKey[]; message: string }>
): string {
  const formattedIssues = issues.map((issue) => {
    const path =
      issue.path.length > 0 ? issue.path.map(String).join('.') : prefix;
    return `${path}: ${issue.message}`;
  });

  return `Validation failed (${prefix}): ${formattedIssues.join(', ')}`;
}

export function validateRequest(schema: ValidationSchema): RequestHandler {
  return (req, _res, next) => {
    if (schema.body) {
      const result = schema.body.safeParse(req.body);

      if (!result.success) {
        return next(
          new AppError(formatValidationError('body', result.error.issues), 400)
        );
      }

      req.body = result.data;
    }

    if (schema.params) {
      const result = schema.params.safeParse(req.params);

      if (!result.success) {
        return next(
          new AppError(
            formatValidationError('params', result.error.issues),
            400
          )
        );
      }

      req.params = result.data as any;
    }

    if (schema.query) {
      const result = schema.query.safeParse(req.query);

      if (!result.success) {
        return next(
          new AppError(formatValidationError('query', result.error.issues), 400)
        );
      }

      req.query = result.data as any;
    }

    return next();
  };
}
