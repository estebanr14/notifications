export interface IMessage {
  id?: string;
  from?: string;
  to?: string;
  template: string;
  templateArgs: object;
  sentAt?: Date;
  status: string;
  error?: string;
  platform?: string;
  type: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
  providerId?: string;
  webhooksData?: any[];
  campaignId?: string;
}
