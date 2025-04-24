import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class ExceptionBase extends HttpException {
  constructor(
    public readonly message: string,
    public readonly httpStatusCode: HttpStatus,
    public readonly location?: string,
  ) {
    super(message, httpStatusCode);
  }
}
