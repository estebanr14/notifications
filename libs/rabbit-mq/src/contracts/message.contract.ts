// Interfaces
export interface ISendMessageMQPayload {
  to: string;
  template: string;
  templateArgs: object;
  type: string;
  category: string;
  file?: Express.Multer.File;
  campaignId?: string;
}

export interface ISendAdminsAlertMQPayload {
  alert: string;
  template: string;
  templateArgs: object;
  type: string;
  file?: Express.Multer.File;
}

// main object
export const MessageMQContract = {
  Routes: {
    Commands: {
      SendMessage: 'message.command.send-message',
    },
    Events: {
      SendAdminsAlert: 'message.event.send-admins-alert',
    },
  },
} as const;
