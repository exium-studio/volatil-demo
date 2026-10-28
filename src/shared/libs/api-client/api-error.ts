// src/shared/libs/api-client/api-error.ts

export class ApiError extends Error {
  statusCode: number;
  code?: string;
  errors?: Record<string, string[]>;
  isHandled?: boolean;

  constructor(
    message: string,
    statusCode = 500,
    code?: string,
    errors?: Record<string, string[]>,
    isHandled = false,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.isHandled = isHandled;
  }
}
