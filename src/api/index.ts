import mongoose from 'mongoose';
import app from '../app';
import config from '../app/config';

let isConnected = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (!isConnected) {
    await mongoose.connect(config.database_url as string);
    isConnected = true;
  }

  return app(req, res);
}
