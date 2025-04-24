import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { StringValueObject } from './string.value-object';

export class EnumValueObject<T> extends StringValueObject {
  override readonly logger = new Logger(EnumValueObject.name);

  constructor(
    value: string,
    private readonly enumType: T,
    private readonly enumName: string,
  ) {
    super(value);
    this.validateValue(value);
  }

  private validateValue(value: string) {
    if (!value) return;
    if (!Object.values(this.enumType).includes(value)) {
      this.logger.error(`Invalid ${this.enumName} Value: ${value}`);
      throw new UnprocessableEntityException(`Invalid ${this.enumName}.`);
    }
  }
}
