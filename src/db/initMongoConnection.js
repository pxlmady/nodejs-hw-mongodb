import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const initMongoConnection = async () => {
  const mongoUri = `mongodb+srv://yoplufre:jd1khY0BwPSHQcTF@cluster0.viitrda.mongodb.net/contacts?retryWrites=true&w=majority&appName=Cluster0`;
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection error:', error);
    process.exit(1);
  }
};
