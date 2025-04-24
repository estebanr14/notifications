import { Logger, UnprocessableEntityException } from '@nestjs/common';
import * as crypto from 'crypto';
import { StringValueObject } from '../../../value-objects/string.value-object';

export class EmailValueObject extends StringValueObject {
  constructor(
    email: string,
    options?: { encrypt?: boolean; fromDatabase?: boolean },
  ) {
    super(email, options);
    this.validateEmail(email, options?.fromDatabase);
  }
  override readonly logger = new Logger(EmailValueObject.name);

  public toHashed(): string {
    const emailHash = crypto
      .createHash('sha256')
      .update(this.value)
      .digest('hex');
    return emailHash;
  }

  private validateEmail(email: string, fromDatabase: boolean) {
    if (!email || fromDatabase) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.logger.error(`Invalid email format. Email: ${email}`);
      throw new UnprocessableEntityException('Invalid email format.');
    }
  }
}
