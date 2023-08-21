import HTTP_STATUS from 'http-status-codes';

export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;
  serializeErrors(): IError;
}

export interface IError {
  message: string;
  statusCode: number;
  status: string;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
  serializeErrors(): IError {
    return {
      message: this.message,
      statusCode: this.statusCode,
      status: this.status,
    };
  }
}

export class BadRequestError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = 'Bad Request';
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  statusCode = HTTP_STATUS.NOT_FOUND;
  status = 'Not Found';
  constructor(message: string) {
    super(message);
  }
}

export class InternalServerError extends CustomError {
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  status = 'Internal Server Error';
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends CustomError {
  statusCode = HTTP_STATUS.UNAUTHORIZED;
  status = 'Unauthorized';
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends CustomError {
  statusCode = HTTP_STATUS.FORBIDDEN;
  status = 'Forbidden';
  constructor(message: string) {
    super(message);
  }
}

export class UnprocessableEntityError extends CustomError {
  statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
  status = 'Unprocessable Entity';
  constructor(message: string) {
    super(message);
  }
}
