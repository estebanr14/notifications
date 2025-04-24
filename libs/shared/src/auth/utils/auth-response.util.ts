import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AuthResponseUtil {
  static setAuthHeaders(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    res.setHeader('access-token', accessToken);
    res.setHeader('refresh-token', refreshToken);
  }
}
