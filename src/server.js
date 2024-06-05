import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import contactsRouter from './routers/contacts.js';
import { HttpError } from 'http-errors';

const PORT = Number(env('PORT', '3000'));
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
  });
};
export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    })
  );
  app.use(express.json());
  app.use((req, res, next) => {
    console.log(`Time:${new Date().toLocaleString()}`);
    next();
  });
  app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
  });
  app.use(contactsRouter);
  app.use('*', (req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });
  app.use('*', notFoundHandler);

  app.use(errorHandler);
  app.listen(PORT, () => console.log(`Server started on ${PORT}`));
};
