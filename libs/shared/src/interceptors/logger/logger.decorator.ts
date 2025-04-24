import { applyDecorators, SetMetadata } from '@nestjs/common';
import { LoggerInterceptorConstants } from './logger.interceptor.constants';

type LoggerDecoratorOptions = {
  printLogs?: boolean;
  printRequest?: boolean;
  printResponse?: boolean;
};

export function LoggerDecorator(
  options: LoggerDecoratorOptions = {},
): MethodDecorator {
  const {
    printRequest = true,
    printResponse = true,
    printLogs = true,
  } = options;
  return applyDecorators(
    SetMetadata(LoggerInterceptorConstants.DONT_PRINT_REQ_KEY, !printRequest),
    SetMetadata(LoggerInterceptorConstants.DONT_PRINT_RES_KEY, !printResponse),
    SetMetadata(LoggerInterceptorConstants.DONT_PRINT_LOGS_KEY, !printLogs),
  );
}
