import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import mongoose from 'mongoose'; // Import mongoose
import { env } from './utils/env.js';
import { getContactById, getContacts } from './services/contacts.js';

const PORT = Number(env('PORT', '3000'));

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

  app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
  });

  app.get('/', (req, res) => {
    res.json({ status: 200, message: 'Hello World' });
  });

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getContacts();
      res
        .status(200)
        .json({ status: 200, data: contacts, message: 'Successfully found contacts!' });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: 'Error fetching contacts', error: error.message });
    }
  });

  app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 400, message: 'Invalid contact ID format' });
    }

    try {
      const contact = await getContactById(id);
      if (!contact) {
        return res.status(404).json({
          status: 404,
          message: `Contact with id ${id} not found`,
        });
      }
      res.status(200).json({
        status: 200,
        data: contact,
        message: `Successfully found contact with id ${id}`,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: 'Error fetching contact', error: error.message });
    }
  });

  app.use('*', (req, res) => {
    res.status(404).json({ status: 404, message: 'Not found' });
  });

  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};
