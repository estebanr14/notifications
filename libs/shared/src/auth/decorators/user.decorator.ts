import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserRequest } from '../domain/entities/auth.interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUserRequest => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
