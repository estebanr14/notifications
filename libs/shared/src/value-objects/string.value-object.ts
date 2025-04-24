import { Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export class StringValueObject {
  private _value: string;
  private readonly _isEncrypted: boolean;
  private static readonly IV_LENGTH = 16;
  readonly logger = new Logger(StringValueObject.name);

  constructor(
    value?: string,
    options?: { encrypt?: boolean; fromDatabase?: boolean },
  ) {
    try {
      const { encrypt = false, fromDatabase = false } = options || {};
      this._isEncrypted = fromDatabase;
      if (!value) {
        this._value = undefined;
        this._isEncrypted = false;
      } else if (fromDatabase) {
        this._value = value;
      } else if (encrypt) {
        this._value = StringValueObject.encrypt(value);
        this._isEncrypted = true;
      } else {
        this._value = value;
        this._isEncrypted = false;
      }
    } catch (error) {
      this.logger.error(
        `Error building string value object: ${value} options: ${JSON.stringify(options)} ${error}`,
      );
    }
  }

  get value(): string {
    if (this._isEncrypted) {
      return StringValueObject.decrypt(this._value);
    }
    return this._value;
  }

  get encryptedValue(): string {
    return this._value;
  }

  private static encrypt(text: string): string {
    const iv = crypto.randomBytes(StringValueObject.IV_LENGTH);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(process.env.ENCRYPTION_KEY),
      iv,
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  private static decrypt(text: string): string {
    const [ivHex, encryptedText] = text.split(':');
    if (!ivHex || !encryptedText) {
      throw new Error('Invalid encrypted text format');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(process.env.ENCRYPTION_KEY),
      iv,
    );
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  public toString(): string {
    return this.value;
  }
}
