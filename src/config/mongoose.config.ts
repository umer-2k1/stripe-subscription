import { MongooseModuleOptions } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

export const connectDB = async (
  configService: ConfigService,
): Promise<void> => {
  const logger = new Logger('Database');
  const mongoURI = configService.get<string>('MONGO_URI');

  if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in the environment variables.');
  }

  try {
    await mongoose.connect(mongoURI);
    logger.log('🍀 Connected to MongoDB successfully!');
  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

export const mongooseConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => ({
  uri: configService.get<string>('MONGO_URI') || '',
});
