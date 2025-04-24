import {
  CommandBus,
  EventBus,
  ICommand,
  IEvent,
  IQuery,
  QueryBus,
} from '@nestjs/cqrs';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Implementation of CQRS Caller using NestJS CQRS module.
 */
@Injectable()
export class NestCqrsCaller {
  private logger: Logger = new Logger(NestCqrsCaller.name);

  constructor(
    private readonly dispatcher: CommandBus,
    private readonly consultant: QueryBus,
    private readonly emitter: EventBus,
  ) {}

  async dispatch<CommandBase extends ICommand = ICommand, Res = unknown>(
    command: CommandBase,
    logCommand: boolean = true,
    logResult: boolean = true,
  ): Promise<Res> {
    let log = `[Dispatch] - INIT - Dispatching command ${command.constructor.name}`;
    if (logCommand) log += ` :: ${JSON.stringify(command)}`;
    this.logger.log(log);
    const result = await this.dispatcher.execute<CommandBase, Res>(command);
    log = `[Dispatch] - FINISH - Command ${command.constructor.name}`;
    if (logResult) log += ` :: Result ${JSON.stringify(result)}`;
    this.logger.log(log);
    return result;
  }

  async query<QueryBase extends IQuery = IQuery, Res = unknown>(
    query: QueryBase,
    logQuery: boolean = true,
    logResult: boolean = true,
  ): Promise<Res> {
    let log = `[Query] - INIT - Executing query ${query.constructor.name}`;
    if (logQuery) log += ` :: ${JSON.stringify(query)}`;
    this.logger.log(log);
    const result = await this.consultant.execute<QueryBase, Res>(query);
    log = `[Query] - FINISH - Query ${query.constructor.name}`;
    if (logResult) log += ` :: Result ${JSON.stringify(result)}`;
    this.logger.log(log);
    return result;
  }

  async emit<EventBase extends IEvent = IEvent>(
    event: EventBase,
    logEvent: boolean = true,
  ): Promise<void> {
    let log = `[Emit] - INIT - Emitting event ${event.constructor.name}`;
    if (logEvent) log += ` :: ${JSON.stringify(event)}`;
    this.logger.log(log);
    this.emitter.publish<EventBase>(event);
    this.logger.log(`[Emit] - FINISH - Event ${event.constructor.name}`);
  }
}
