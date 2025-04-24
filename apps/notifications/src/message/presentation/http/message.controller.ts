import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { NestCqrsCaller } from '@app/shared/cqrs/nest-cqrs-caller.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { SendMessageCommand } from '../../application/commands/send-message.command';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { GetMessageQuery } from '../../application/queries/get-message.query';
import { GetListMessageQuery } from '../../application/queries/get-list-message.query';
import { GetListMessageQueryDto } from '../dtos/get-list-messages.dto';
import { MessageResponseDto } from '../dtos/message.response.dto';
import { JwtAuthGuard, Role, Roles, RolesGuard } from '@app/shared';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('messages')
@Controller('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessageController {
  constructor(private readonly cqrsCaller: NestCqrsCaller) {}

  @Get(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Retrieve a single Message by ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the Message',
    example: '60f718c9b7a8c00015d3f2c4',
  })
  @ApiResponse({
    status: 200,
    description: 'The Message has been retrieved successfully.',
    type: MessageResponseDto,
  })
  async getById(@Param('id') id: string): Promise<MessageResponseDto> {
    return this.cqrsCaller.query(new GetMessageQuery(id));
  }

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Retrieve a list of Message' })
  @ApiResponse({
    status: 200,
    description: 'The list of Message has been retrieved successfully.',
    type: [MessageResponseDto],
  })
  async getList(
    @Query() params: GetListMessageQueryDto,
  ): Promise<MessageResponseDto[]> {
    const { page, limit, sortField, sortOrder, ...filters } = params;
    return this.cqrsCaller.query(
      new GetListMessageQuery(filters, { page, limit, sortField, sortOrder }),
    );
  }

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a new Message' })
  @ApiResponse({
    status: 201,
    description: 'The Message has been created successfully.',
    type: MessageResponseDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    return this.cqrsCaller.dispatch(
      new SendMessageCommand(
        dto.to,
        dto.template,
        dto.templateArgs,
        dto.type,
        dto.category,
        file,
      ),
      false,
      true,
    );
  }
}
