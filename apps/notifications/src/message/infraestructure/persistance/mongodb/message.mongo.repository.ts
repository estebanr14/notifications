import { Injectable } from '@nestjs/common';
import { BaseMongoRepository } from '@app/database/mongo/base.mongo.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MessageDocument } from './message.mongo.schema';
import { MongoConstantsProvider } from '@app/database';
import { IMessage } from '../../../domain/interfaces/message.interface';

@Injectable()
export class MessageMongoRepository extends BaseMongoRepository<
  MessageDocument,
  IMessage
> {
  constructor(
    @InjectModel(MongoConstantsProvider.MongoMessageSchema)
    private readonly messageModel: Model<MessageDocument>,
  ) {
    super(messageModel, MongoConstantsProvider.MongoMessageSchema);
  }
}
