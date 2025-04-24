export class BaseLoginCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly role: string,
  ) {}
}
