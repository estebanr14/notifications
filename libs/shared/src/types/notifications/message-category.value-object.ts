import { EnumValueObject } from '@app/shared/value-objects/base-enum.value-object';

export enum MessageCategoryEnum {
  SUPPORT = 'SUPPORT',
  MARKETING = 'MARKETING',
  TRANSACTIONAL = 'TRANSACTIONAL',
  ALERT = 'ALERT',
}

export class MessageCategory extends EnumValueObject<
  typeof MessageCategoryEnum
> {
  constructor(value: string) {
    super(value, MessageCategoryEnum, 'MessageCategory');
  }
}
