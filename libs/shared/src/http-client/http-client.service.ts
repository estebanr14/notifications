import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { HttpInput, HttpOutput, IHttpClient } from './http-client.interface';
import { AxiosResponse } from 'axios';

@Injectable()
export class HttpClientService implements OnModuleInit, IHttpClient {
  private readonly logger = new Logger(HttpClientService.name);

  constructor(private readonly httpService: HttpService) {}

  onModuleInit() {
    const axiosRef = this.httpService.axiosRef;

    axiosRef.interceptors.request.use(
      (config) => {
        this.logger.debug(
          `Request [${config.method?.toUpperCase()}] ${config.url}`,
        );
        return config;
      },
      (error) => {
        this.logger.error(`Request error: ${error.message}`, error.stack);
        return Promise.reject(error);
      },
    );

    axiosRef.interceptors.response.use(
      (response) => {
        this.logger.debug(
          `Response [${response.status}] ${response.config.method?.toUpperCase()} ${response.config.url}`,
        );
        return response;
      },
      (error) => {
        if (error.response) {
          this.logger.error(
            `Response error: \nstatus: ${error.status} \nurl: ${error.config.url}, \ncode: ${error.code}, \nmessage: ${error.message}`,
          );
        } else {
          this.logger.error(`Response error (no response)`, error.stack);
        }
        return Promise.reject(error);
      },
    );
  }

  async get<I, O>(input: HttpInput<I>): Promise<HttpOutput<O>> {
    const { url, headers, params } = input;

    try {
      const response: AxiosResponse<O> = await this.httpService.axiosRef.get<O>(
        url,
        { headers, params },
      );
      return {
        status: response.status,
        body: response.data,
        headers: response.headers,
        error: false,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<I, O>(input: HttpInput<I>): Promise<HttpOutput<O>> {
    const { url, headers, params, body } = input;

    try {
      const response: AxiosResponse<O> =
        await this.httpService.axiosRef.post<O>(url, body, { headers, params });
      return { status: response.status, body: response.data, error: false };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<I, O>(input: HttpInput<I>): Promise<HttpOutput<O>> {
    const { url, headers, body, params } = input;

    try {
      const response: AxiosResponse<O> = await this.httpService.axiosRef.put<O>(
        url,
        body,
        { headers, params },
      );
      return { status: response.status, body: response.data, error: false };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async patch<I, O>(input: HttpInput<I>): Promise<HttpOutput<O>> {
    const { url, headers, body, params } = input;

    try {
      const response: AxiosResponse<O> =
        await this.httpService.axiosRef.patch<O>(url, body, {
          headers,
          params,
        });
      return { status: response.status, body: response.data, error: false };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<I, O>(input: HttpInput<I>): Promise<HttpOutput<O>> {
    const { url, headers, params } = input;

    try {
      const response: AxiosResponse<O> =
        await this.httpService.axiosRef.delete<O>(url, { headers, params });
      return { status: response.status, body: response.data, error: false };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): HttpOutput<any> {
    const status = error?.response?.status ?? 500;
    const message = error.message || 'Unknown error';
    const code = error.code || 'Unknown error';
    const body = error.response?.data || {};
    return { status, error: true, message, code, body };
  }
}
