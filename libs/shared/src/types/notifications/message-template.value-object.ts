import { EnumValueObject } from '@app/shared/value-objects/base-enum.value-object';

export enum MessageTemplateEnum {
  DEFAULT = 'DEFAULT',
  //Whatsapp
  TRACKING_LINK = 'TRACKING_LINK',
  TRACKING_LINK_WITHOUT_NAME = 'TRACKING_LINK_WITHOUT_NAME',
  SHIPMENT_COMPLETED_ADMINS = 'SHIPMENT_COMPLETED_ADMINS',
  SHIPMENT_COMPLETED_CLIENT = 'SHIPMENT_COMPLETED_CLIENT',
  AUTOMATIC_RESPONSE = 'AUTOMATIC_RESPONSE',
  WOMENS_DAY = 'WOMENS_DAY',
  SUNDAY_OFFER = 'SUNDAY_OFFER',
  OFFER_1 = 'OFFER_1',
  //Email
  WELCOME = 'WELCOME',
  PASSWORD_RESET = 'PASSWORD_RESET',
  NEWSLETTER = 'NEWSLETTER',
  MFA = 'MFA',
  //Sms
  SHIPPING_NOTIFICATION = 'SHIPPING_NOTIFICATION',
}

export enum MessageSubjectEnum {
  WELCOME = 'Bienvenido a Bety',
  PASSWORD_RESET = 'Restablecer contraseña',
  NEWSLETTER = 'Newsletter',
  MFA = 'Tu código OTP para iniciar sesión en Bety',
  DEFAULT = 'Email de Bety',
}

export class MessageTemplate extends EnumValueObject<
  typeof MessageTemplateEnum
> {
  constructor(template: string) {
    super(template, MessageTemplateEnum, 'MessageTemplate');
  }

  public static getSubject(template: string): string {
    return MessageSubjectEnum[template];
  }
}
