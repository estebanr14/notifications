import { EnumValueObject } from '@app/shared/value-objects/base-enum.value-object';

export enum AlertEnum {
  STOCK_REPORT = 'STOCK_REPORT',
  SHIPMENT_COMPLETED = 'SHIPMENT_COMPLETED',
  SHIPMENT_CANCELLED = 'SHIPMENT_CANCELLED',
  CORE_ERROR = 'CORE_ERROR',
}

export class Alert extends EnumValueObject<typeof AlertEnum> {
  constructor(value: string) {
    super(value, AlertEnum, 'AlertEnum');
  }
}
