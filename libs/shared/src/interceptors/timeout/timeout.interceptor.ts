import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import {
  catchError,
  Observable,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';
import { Reflector } from '@nestjs/core';
import { TimeoutInterceptorConstants } from './timeout.interceptor.constants';
import { CONFIG, Config } from '../../../../config/src';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private logger: Logger = new Logger(TimeoutInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    @Inject(CONFIG) private readonly config: Config,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const cancelTimeout: boolean = this.reflector.get<boolean>(
      TimeoutInterceptorConstants.CANCEL_TIMEOUT_METADATA_KEY,
      context.getHandler(),
    );
    if (cancelTimeout) {
      return next.handle();
    } else {
      const timeMs: number =
        this.reflector.get<number>(
          TimeoutInterceptorConstants.TIMEOUT_METADATA_KEY,
          context.getHandler(),
        ) ?? Number(this.config.defaultTimeoutMs);
      this.logger.log(
        `[${context.getHandler().name}] - TIMEOUT SET ON ${timeMs}`,
      );

      return next.handle().pipe(
        timeout(timeMs),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            new Logger(context.getHandler().name).error(
              `${err.message} exceed ${timeMs}`,
            );
            return throwError(() => new RequestTimeoutException());
          }
          return throwError(() => err);
        }),
      );
    }
  }
}
