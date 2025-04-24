import { Message } from '../entities/message.entity';

export interface IMessageSender {
  platform: string;
  fromValue: string;
  sendMessage(
    message: Message,
    file?: Express.Multer.File,
  ): Promise<{ success: boolean; error?: string; id?: string }>;
  sendMessageMock(
    message: Message,
    file?: Express.Multer.File,
  ): Promise<{ success: boolean; error?: string; id?: string }>;
}
