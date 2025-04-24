import { EnumValueObject } from '@app/shared/value-objects/base-enum.value-object';

export enum MessageStatusEnum {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export class MessageStatus extends EnumValueObject<typeof MessageStatusEnum> {
  constructor(value: string) {
    super(value, MessageStatusEnum, 'MessageStatus');
  }
}
