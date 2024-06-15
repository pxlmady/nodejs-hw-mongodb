import { HttpError } from 'http-errors';
import { MongooseError } from 'mongoose';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      error: err.name,
    });
    return;
  }

  if (err instanceof MongooseError) {
    res.status(500).json({
      status: 500,
      message: 'Database Error',
      error: err.message,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
    error: err.message,
  });
  next(err);
};
