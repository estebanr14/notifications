import { Reflector } from '@nestjs/core';
import {
  ArgumentsHost,
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerInterceptorConstants } from './logger.interceptor.constants';
import { Request } from 'express';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  static resolveRequests(context: ArgumentsHost): unknown {
    switch (context.getType()) {
      case 'http': {
        const request = context.switchToHttp().getRequest<Request>();
        return request.method === 'GET' ? request.query : request.body;
      }
      default: {
        throw new Error('Context Not implemented');
      }
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (
      !this.reflector.get(
        LoggerInterceptorConstants.DONT_PRINT_LOGS_KEY,
        context.getHandler(),
      )
    ) {
      const logger: Logger = new Logger(context.getClass().name);
      const printRequest = !this.reflector.get(
        LoggerInterceptorConstants.DONT_PRINT_REQ_KEY,
        context.getHandler(),
      );
      const printResponse = !this.reflector.get(
        LoggerInterceptorConstants.DONT_PRINT_RES_KEY,
        context.getHandler(),
      );
      const request = printRequest
        ? LoggerInterceptor.resolveRequests(context)
        : undefined;
      const now = Date.now();
      logger.log(
        `[${context.getHandler().name}] INIT :: ${request ? `data: ${JSON.stringify(request)}` : ''}`,
      );
      return next
        .handle()
        .pipe(
          tap((value: unknown) =>
            logger.log(
              `[${context.getHandler().name}] FINISH :: in: ${Date.now() - now}ms - ${
                printResponse ? `response: ${JSON.stringify(value)}` : ''
              }`,
            ),
          ),
        );
    } else {
      return next.handle();
    }
  }
}
