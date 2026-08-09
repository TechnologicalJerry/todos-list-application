import { ErrorHandler, NotFoundHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
import { ContentfulStatusCode } from 'hono/utils/http-status';

export const globalErrorHandler: ErrorHandler = (err, c) => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Handle Hono HTTPException
  if (err instanceof HTTPException) {
    const status = err.status;
    return c.json(
      {
        success: false,
        error: {
          message: err.message || 'HTTP Error',
          code: `HTTP_${status}`,
          ...(isProduction ? {} : { stack: err.stack }),
        },
      },
      status
    );
  }

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    return c.json(
      {
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
      },
      400
    );
  }

  // Log unhandled server errors
  console.error('Unhandled Server Error:', err);

  const status: ContentfulStatusCode = 500;
  return c.json(
    {
      success: false,
      error: {
        message: isProduction ? 'Internal Server Error' : err.message || 'Unknown Server Error',
        code: 'INTERNAL_SERVER_ERROR',
        ...(isProduction ? {} : { stack: err.stack }),
      },
    },
    status
  );
};

export const notFoundHandler: NotFoundHandler = (c) => {
  return c.json(
    {
      success: false,
      error: {
        message: `Route not found: ${c.req.method} ${c.req.path}`,
        code: 'NOT_FOUND',
      },
    },
    404
  );
};
