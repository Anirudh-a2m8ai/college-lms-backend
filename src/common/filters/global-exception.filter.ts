import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

type HttpExceptionResponse =
  | string
  | {
      statusCode?: number;
      message?: string | string[];
      error?: string;
    };

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse() as HttpExceptionResponse;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (exceptionResponse?.message) {
        message = exceptionResponse.message;
      }
    }

    response.status(status).json({
      status: 'failed',
      statusCode: status,
      error: 'ApplicationError',
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
