export class BaseRefreshTokenCommand {
  constructor(
    public readonly refreshToken: string,
    public readonly role: string,
  ) {}
}
