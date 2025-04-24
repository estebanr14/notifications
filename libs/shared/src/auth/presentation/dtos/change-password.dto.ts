import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'current password',
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'current password',
  })
  @IsString()
  newPassword: string;
}
