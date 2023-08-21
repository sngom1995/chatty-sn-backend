import Logger from 'bunyan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { config } from './config';
dotenv.config();

const logger: Logger = config.createLogger('setupDatabase');

export default async () => {
  const connect = async () => {
    try {
      console.log(config.MONGODB_URI);
      await mongoose.connect(process.env.MONGODB_URI!, {});
      logger.info('Successfully connected to database');
    } catch (error) {
      logger.error('Error connecting to database: ', error);
      return process.exit(1);
    }
  };
  connect();
  mongoose.connection.on('disconnected', connect);
};
