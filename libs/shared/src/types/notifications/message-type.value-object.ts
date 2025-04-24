import { EnumValueObject } from '@app/shared/value-objects/base-enum.value-object';

export enum MessageTypeEnum {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
}

export class MessageType extends EnumValueObject<typeof MessageTypeEnum> {
  constructor(value: string) {
    super(value, MessageTypeEnum, 'MessageType');
  }

  static typesByPhoneNumber(type: MessageType): boolean {
    const typesByPhoneNumber = [MessageTypeEnum.WHATSAPP, MessageTypeEnum.SMS];
    for (const [, value] of Object.entries(typesByPhoneNumber)) {
      if (value === type.value) {
        return true;
      }
    }
    return false;
  }
}
