import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

let cached: typeof mongoose | null = null;

async function dbConnect() {
  if (cached) {
    return cached;
  }

  try {
    const opts = {
      bufferCommands: false,
    };

    cached = await mongoose.connect(MONGODB_URI, opts);
    return cached;
  } catch (e) {
    cached = null;
    throw e;
  }
}

export default dbConnect;