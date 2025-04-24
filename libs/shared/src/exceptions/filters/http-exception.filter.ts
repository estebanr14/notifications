import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ExceptionResponseDto } from '../models/exception-response.dto';
import { ExceptionBase } from '../models/exception-base';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  public catch(exception: unknown, host: ArgumentsHost): void {
    const response: ExceptionResponseDto = new ExceptionResponseDto();
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    response.timestamp = new Date().toISOString();
    response.path = req?.url || 'unknown';

    if (exception instanceof ExceptionBase) {
      this.logger.error(`[Controlled Exception]: ${exception.message}`);
      response.httpStatusCode = exception.httpStatusCode;
      response.message = exception.message;
    } else if (exception instanceof HttpException) {
      this.logger.error(`[HttpException]: ${exception.message}`);
      response.httpStatusCode = exception.getStatus();
      response.message = exception.getResponse() as string | string[];
    } else {
      this.logger.error(`[Unexpected Exception]: ${exception}`);
      response.httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response.message = 'Internal Server Error';
    }

    res.status(response.httpStatusCode).json(response);
  }
}
