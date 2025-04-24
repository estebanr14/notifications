import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { StringValueObject } from './string.value-object';

export class PhoneNumberValueObject extends StringValueObject {
  constructor(
    phoneNumber: string,
    options?: { encrypt?: boolean; fromDatabase?: boolean },
  ) {
    super(phoneNumber, options);
    this.validatePhoneNumber(phoneNumber, options?.fromDatabase);
  }
  override readonly logger = new Logger(PhoneNumberValueObject.name);

  private validatePhoneNumber(phoneNumber: string, fromDatabase: boolean) {
    if (!phoneNumber || fromDatabase) return;
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      this.logger.error(
        `Invalid phone number format. It must include the indicator and contain between 10 and 15 digits. Phone number: ${phoneNumber}`,
      );
      throw new UnprocessableEntityException(
        'Invalid phone number format. It must include the indicator and contain between 10 and 15 digits.',
      );
    }
  }
}
