import { Contacts } from '../db/models/contact.js';
import mongoose from 'mongoose';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getContacts = async ({
  page = 1,
  perPage = 5,
  sortBy = 'name',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const contactsQuery = Contacts.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite', filter.isFavourite);
  }

  const contactsCount = await Contacts.find().merge(contactsQuery).countDocuments();
  const paginationData = calculatePaginationData(contactsCount, page, perPage);
  const numberOfPages = paginationData.totalPages;
  const skip = page <= numberOfPages ? (page - 1) * perPage : 0;

  const contacts = await contactsQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .exec();

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async id => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return Contacts.findById(id);
};

export const createContact = async data => {
  try {
    return await Contacts.create(data);
  } catch (error) {
    console.error('Error in createContact:', error);
    throw new Error(`Contact creation failed: ${error.message}`);
  }
};

export const deleteContact = async contactId => {
  return Contacts.findOneAndDelete({ _id: contactId });
};

export const updateContact = async (contactId, payload, options = {}) => {
  const result = await Contacts.findOneAndUpdate({ _id: contactId }, payload, {
    new: true,
    ...options,
  });

  return result ? { contact: result } : null;
};
