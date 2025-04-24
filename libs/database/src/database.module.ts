import { Global, Module } from '@nestjs/common';
import { MongoProvider } from './mongo/mongo.provider';

@Global()
@Module({
  providers: [MongoProvider],
  exports: [MongoProvider],
})
export class DatabaseModule {}
