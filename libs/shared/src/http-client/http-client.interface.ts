export interface HttpInput<I> {
  url: string;
  headers?: Record<string, string>;
  body?: I;
  params?: Record<string, any>;
}

export interface HttpSuccessResponse<O> {
  status: number;
  headers?: any;
  body: O;
  error: false;
}
export interface HttpErrorResponse {
  status: number;
  body?: any;
  headers?: any;
  error: true;
  message: string;
  code?: string;
}

export type HttpOutput<O> = HttpSuccessResponse<O> | HttpErrorResponse;

export interface IHttpClient {
  get<I, O>(input: HttpInput<I>): Promise<HttpOutput<O>>;
  post<I, O>(input: HttpInput<I>): Promise<HttpOutput<O>>;
  put<I, O>(input: HttpInput<I>): Promise<HttpOutput<O>>;
  patch<I, O>(input: HttpInput<I>): Promise<HttpOutput<O>>;
  delete<I, O>(input: HttpInput<I>): Promise<HttpOutput<O>>;
}
