import { Model, FilterQuery, UpdateQuery, ClientSession } from 'mongoose';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PaginatedParams, PaginatedResult } from '../domain/pagination.dto';

@Injectable()
export abstract class BaseMongoRepository<T, TEntity> {
  protected readonly logger: Logger;

  constructor(
    protected readonly model: Model<T>,
    protected readonly modelName: string,
  ) {
    this.logger = new Logger(modelName);
  }

  async create(payload: Partial<T>): Promise<TEntity> {
    this.logger.log(`Creating ${this.modelName}: ${JSON.stringify(payload)}`);
    try {
      const document = await this.model.create(payload);
      return document.toJSON() as TEntity;
    } catch (error) {
      this.handleException('create', error);
    }
  }

  async createMany(data: Partial<T>[], ordered = true): Promise<Array<any>> {
    this.logger.log(`Creating multiple ${this.modelName}`);
    try {
      return await this.model.insertMany(data, { ordered });
    } catch (error) {
      this.handleException('createMany', error);
    }
  }

  async update(
    query: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: { session?: ClientSession },
  ): Promise<TEntity | null> {
    if (query.id) {
      query = { _id: query.id, ...query };
      delete query.id;
    }

    this.logger.log(`Updating ${this.modelName}: ${JSON.stringify(query)}`);
    try {
      const document = await this.model
        .findOneAndUpdate(query, update, {
          new: true,
          session: options?.session,
        })
        .exec();
      return document?.toJSON() as TEntity;
    } catch (error) {
      this.handleException('update', error);
    }
  }

  async delete(query: FilterQuery<T>): Promise<boolean> {
    this.logger.log(`Deleting ${this.modelName}: ${JSON.stringify(query)}`);
    try {
      if (query.id) {
        query = { _id: query.id, ...query };
        delete query.id;
      }
      const result = await this.model.deleteOne(query).exec();
      return result.deletedCount > 0;
    } catch (error) {
      this.handleException('delete', error);
    }
  }

  async findOne(
    query: FilterQuery<T>,
    options?: { session?: ClientSession },
  ): Promise<TEntity | null> {
    this.logger.log(`Finding one ${this.modelName}: ${JSON.stringify(query)}`);
    try {
      if (query.id) {
        query = { _id: query.id, ...query };
        delete query.id;
      }
      const document = await this.model
        .findOne(query, null, { session: options?.session })
        .exec();
      return document?.toJSON() as TEntity;
    } catch (error) {
      this.handleException('findOne', error);
    }
  }

  async findById(id: string): Promise<TEntity | null> {
    this.logger.log(`Finding by id ${this.modelName}: ${id}`);
    try {
      if (!id) return null;
      const document = await this.model.findById(id).exec();
      return document?.toJSON() as TEntity;
    } catch (error) {
      this.handleException('findById', error);
    }
  }

  async find(query: FilterQuery<T>): Promise<TEntity[]> {
    this.logger.log(`Finding ${this.modelName}: ${JSON.stringify(query)}`);
    try {
      if (query.id) {
        query = { _id: query.id, ...query };
        delete query.id;
      }
      const results = await this.model.find(query).exec();
      return results.map((result) => result.toJSON() as TEntity);
    } catch (error) {
      this.handleException('find', error);
    }
  }

  async paginatedSearch(
    params: PaginatedParams,
  ): Promise<PaginatedResult<TEntity>> {
    this.logger.log(`Paginated search for ${this.modelName}`);
    const { page, limit, sort, search } = params.getValues();
    const skip = (page - 1) * limit;

    try {
      const results = await this.model
        .find(search)
        .collation({ locale: 'en', strength: 2 })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();

      const total = await this.model.countDocuments(search).exec();

      return {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit,
        results: results.map((result) => result.toJSON() as TEntity),
      };
    } catch (error) {
      this.handleException('paginatedSearch', error);
    }
  }

  async updateMany(
    query: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    this.logger.log(
      `Updating many ${this.modelName}: ${JSON.stringify(query)}`,
    );
    try {
      if (query.id) {
        query = { _id: query.id, ...query };
        delete query.id;
      }
      const result = await this.model.updateMany(query, update).exec();
      return {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      };
    } catch (error) {
      this.handleException('updateMany', error);
    }
  }

  private handleException(operation: string, error: any): never {
    this.logger.error(`${operation} failed: ${error.message}`, error.stack);
    throw new InternalServerErrorException(
      `Failed to ${operation} ${this.modelName}: ${error.message}`,
    );
  }
}
