import {
  getContactById,
  getContacts,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  try {
    const { page = 1, perPage = 5 } = parsePaginationParams(req.query);
    const { sortby, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const contacts = await getContacts({ page, perPage, sortby, sortOrder, filter });

    res.status(200).json({
      status: 200,
      data: contacts,
      message: 'Contacts retrieved successfully!',
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error fetching contacts',
      error: error.message,
    });
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.id);

    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      data: contact,
      message: `Contact with ID ${req.params.id} retrieved successfully!`,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error fetching contact',
      error: error.message,
    });
  }
};

export const createContactController = async (req, res) => {
  try {
    const { name, phoneNumber, contactType } = req.body;

    if (!name || !phoneNumber || !contactType) {
      return res.status(400).json({
        status: 400,
        message: 'Bad Request: name, phoneNumber, and contactType are required',
      });
    }

    const contact = await createContact(req.body);

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully!',
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error creating contact',
      error: error.message,
    });
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const contact = await deleteContact(contactId);

    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error deleting contact',
      error: error.message,
    });
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const result = await updateContact(contactId, req.body);

    if (!result) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully!',
      data: result.contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error updating contact',
      error: error.message,
    });
  }
};

export const validateBody = schema => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      createHttpError(400, {
        message: 'Bad Request',
        error: error.details.map(e => e.message),
      })
    );
  }
};
