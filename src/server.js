import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import contactsRouter from './routers/contacts.js';
import { HttpError } from 'http-errors';

const PORT = Number(env('PORT', '3000'));

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: 404,
    message: 'Route not found',
  });
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  const data = err.data || {};

  res.status(status).json({
    status,
    message,
    data,
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

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server started on ${PORT}`));
};
