import { Schema, model } from 'mongoose';
const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
      required: false,
    },

    phoneNumber: { type: String, required: true },

    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      required: true,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
  },
  { timestamps: true }
);
export const Contacts = model('Contact', contactSchema);
