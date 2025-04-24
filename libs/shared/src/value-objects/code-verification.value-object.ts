import * as bcrypt from 'bcrypt';

export interface IVerificationCode {
  code: string;
  expirationDate?: Date;
}

export class CodeVerificationValueObject {
  private readonly code: string;
  private readonly expirationDate: Date;

  constructor(code: string, expirationDate?: Date, fromDatabase = false) {
    if (!code) return;
    this.code = fromDatabase ? code : bcrypt.hashSync(code, 10);
    if (expirationDate) {
      this.expirationDate = expirationDate;
    } else {
      this.expirationDate = new Date();
      this.expirationDate.setMinutes(this.expirationDate.getMinutes() + 10);
    }
  }

  public static generateCode(): {
    code: string;
    codeVerificationValueObject: CodeVerificationValueObject;
  } {
    // Generate a random 8-digit number
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    return {
      code, // We return the raw code to send it in the emails
      codeVerificationValueObject: new CodeVerificationValueObject(code),
    };
  }

  public async isCodeValid(code: string): Promise<boolean> {
    return bcrypt.compare(code, this.code);
  }

  public isCodeExpired(): boolean {
    return new Date() > this.expirationDate;
  }

  get value(): IVerificationCode | undefined {
    if (!this.code) return undefined;
    return {
      code: this.code,
      expirationDate: this.expirationDate,
    };
  }
}
