export type MessageResponse<T> = ErrorResponse | SuccessResponse<T>;

interface SuccessResponse<T> {
  success: true;
  data: T;
  error?: never;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
