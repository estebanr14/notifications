import { FactoryProvider, Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { MongoConstantsProvider } from './mongo.constants';
import { Config, CONFIG } from '../../../config/src';

export const MongoProvider: FactoryProvider = {
  provide: MongoConstantsProvider.MongoConnection,
  useFactory: async (config: Config): Promise<typeof mongoose> => {
    const logger = new Logger('MongoDbProvider');
    const connectionString = `${config.mongo.uri}/${config.mongo.dbName}?retryWrites=true&w=majority&appName=${config.mongo.dbName}`;
    const connection = await mongoose.connect(connectionString);
    logger.log('MongoDB connected');
    return connection;
  },
  inject: [CONFIG],
};
