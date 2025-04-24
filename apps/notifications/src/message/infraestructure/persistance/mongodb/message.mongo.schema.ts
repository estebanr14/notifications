import { Schema, HydratedDocument } from 'mongoose';
import { IMessage } from '../../../domain/interfaces/message.interface';

export type MessageDocument = HydratedDocument<IMessage>;

const MessageSchemaDefinition = {
  from: {
    type: String,
    required: false,
  },
  to: {
    type: String,
    required: false,
  },
  template: {
    type: String,
    required: true,
  },
  templateArgs: {
    type: Object,
    required: true,
  },
  sentAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  error: {
    type: String,
    required: false,
  },
  platform: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  providerId: {
    type: String,
    required: false,
  },
  webhooksData: {
    type: [Object],
    required: false,
  },
  campaignId: {
    type: String,
    required: false,
  },
};

export const MessageSchema = new Schema<IMessage>(MessageSchemaDefinition, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});
