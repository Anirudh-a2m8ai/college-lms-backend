import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class WsAccessTokenGuard extends AuthGuard('jwt') {
  private request: any;

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();

    const token = client.handshake.auth?.token || client.handshake.headers?.authorization;

    this.request = {
      headers: {
        authorization: token ? `Bearer ${token}` : undefined,
      },
    };

    const activate = (await super.canActivate(context)) as boolean;

    client.data.user = this.request.user;

    return activate;
  }

  getRequest(context: ExecutionContext) {
    return this.request;
  }
}
