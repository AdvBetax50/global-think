import { CommonResponse } from './common-response';

export class SuccessResponse implements CommonResponse {
  public status = 200;
  public message = 'success';
  public data = null;

  constructor(data?: any, status?: number, message?: string) {
    this.status = status ?? this.status;
    this.message = message ?? this.message;
    this.data = data ?? this.data;
  }

}

export class ErrorResponse implements CommonResponse {
  public status = 500;
  public message = 'error in server';

  constructor (status?: number, message?: string) {
    this.status = status ?? this.status;
    this.message = message ?? this.message;
  }

}