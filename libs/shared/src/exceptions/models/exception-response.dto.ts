export class ExceptionResponseDto {
  timestamp: string;
  httpStatusCode: number;
  message: string | string[];
  path: string;
}
