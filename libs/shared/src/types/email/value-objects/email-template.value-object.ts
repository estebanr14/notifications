import { EnumValueObject } from '@app/shared/value-objects';

export enum EmailTemplateEnum {
  WELCOME = 'WELCOME',
  PASSWORD_RESET = 'PASSWORD_RESET',
  NEWSLETTER = 'NEWSLETTER',
  MFA = 'MFA',
  DEFAULT = 'DEFAULT',
}

export enum EmailSubjectEnum {
  WELCOME = 'Bienvenido a Bety',
  PASSWORD_RESET = 'Restablecer contraseña',
  NEWSLETTER = 'Newsletter',
  MFA = 'Tu código OTP para iniciar sesión en Bety',
  DEFAULT = 'Email de Bety',
}

export class EmailTemplate extends EnumValueObject<typeof EmailTemplateEnum> {
  constructor(template: string) {
    super(template, EmailTemplateEnum, 'EmailTemplate');
  }

  public static getSubject(template: string): string {
    return EmailSubjectEnum[template];
  }
}
