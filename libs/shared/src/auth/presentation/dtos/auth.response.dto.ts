import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT Access Token' })
  accessToken: string;

  @ApiProperty({ description: 'JWT Access Token' })
  refreshToken: string;

  @ApiProperty({ description: 'User ID associated with this token' })
  sub: string;
}
