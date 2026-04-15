import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { HttpException } from '@nestjs/common';

@Catch(WsException, HttpException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();

    const message = exception instanceof HttpException ? exception.getResponse() : exception.message;

    client.emit('exception', { status: 'error', message });
  }
}
