import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from 'src/generated/prisma/client';

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientRustPanicError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';

    /**
     * Known Prisma Errors
     */
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002': // Unique constraint failed
          status = HttpStatus.CONFLICT;
          message = `Duplicate value for field(s): ${exception.meta?.target as string}`;
          break;

        case 'P2025': // Record not found
          status = HttpStatus.NOT_FOUND;
          message = 'Requested record does not exist';
          break;

        case 'P2003': // Foreign key constraint failed
          status = HttpStatus.BAD_REQUEST;
          message = 'Invalid reference to related resource';
          break;

        case 'P2014': // Relation violation
          status = HttpStatus.BAD_REQUEST;
          message = 'Invalid relation operation';
          break;

        case 'P2010': // Raw query failed
          status = HttpStatus.BAD_REQUEST;
          message = 'Invalid database query';
          break;

        case 'P2034': // Transaction failed (important)
          status = HttpStatus.CONFLICT;
          message = 'Transaction failed due to concurrent modification';
          break;

        default:
          message = exception.message;
      }
    }

    /**
     * Validation Errors
     */
    if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid database input';
    }

    /**
     * Initialization / Connection Errors
     */
    if (
      exception instanceof Prisma.PrismaClientInitializationError ||
      exception instanceof Prisma.PrismaClientRustPanicError
    ) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Database service unavailable';
    }

    response.status(status).json({
      status: 'failed',
      statusCode: status,
      error: 'PrismaError',
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
