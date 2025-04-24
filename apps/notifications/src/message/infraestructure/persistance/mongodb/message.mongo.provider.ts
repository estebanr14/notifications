import { Connection, Model } from 'mongoose';
import { MongoConstantsProvider } from '@app/database';
import { MessageSchema } from './message.mongo.schema';
import { IMessage } from '../../../domain/interfaces/message.interface';
import { MessageMongoRepository } from './message.mongo.repository';
import { FactoryProvider } from '@nestjs/common';

const MessageDocumentProvider = {
  provide: MongoConstantsProvider.MongoMessageSchema,
  useFactory: (connection: Connection): Model<IMessage> =>
    connection.model<IMessage>('Message', MessageSchema),
  inject: [MongoConstantsProvider.MongoConnection],
};

const MongoMessageRepositoryProvider: FactoryProvider<MessageMongoRepository> =
  {
    inject: [MongoConstantsProvider.MongoMessageSchema],
    provide: MongoConstantsProvider.MongoMessageRepository,
    useFactory: (model) => new MessageMongoRepository(model),
  };

export default [MessageDocumentProvider, MongoMessageRepositoryProvider];
