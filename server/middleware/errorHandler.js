import mongoose from 'mongoose';
import { ZodError } from 'zod';

export function notFoundHandler(_req, res) {
  res.status(404).json({ message: 'Endpoint not found.' });
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed.',
      issues: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (error.name === 'HttpError') {
    res.status(error.statusCode).json({
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ message: 'Database validation failed.' });
    return;
  }

  console.error(error);
  res.status(500).json({ message: 'The server could not process the request.' });
}
