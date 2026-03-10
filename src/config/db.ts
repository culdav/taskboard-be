import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDb(): Promise<void> {
  if (!env.mongoDbUri) {
    throw new Error(
      'MONGODB_URI is not set. Add it to your environment before starting the server.'
    );
  }

  try {
    await mongoose.connect(env.mongoDbUri);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }

  console.log('MongoDB connected');
}

export async function disconnectDb(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}
