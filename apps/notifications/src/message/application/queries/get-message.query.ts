import { IQuery } from '@nestjs/cqrs';

export class GetMessageQuery implements IQuery {
  constructor(public readonly id: string) {}
}
