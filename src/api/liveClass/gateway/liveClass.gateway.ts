import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAccessTokenGuard } from '../../../common/guards/ws-access-token.guard';
import { LiveClassService } from '../liveClass.service';
import { BaseGateway } from 'src/common/gateways/base.gateway';
import { UseFilters, UseGuards } from '@nestjs/common';
import * as socketType from 'src/common/types/socket.type';
import { WsExceptionFilter } from 'src/common/filters/ws-exception.filter';

@WebSocketGateway({
  cors: { origin: '*' },
})
@UseGuards(WsAccessTokenGuard)
@UseFilters(WsExceptionFilter)
export class LiveClassGateway extends BaseGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly service: LiveClassService) {
    super();
  }

  @SubscribeMessage('class:join')
  async handleJoin(@ConnectedSocket() client: socketType.AuthenticatedSocket, @MessageBody() classId: string) {
    await this.service.joinLiveClass(classId, client.data.user.userId);
    client.join(`class-${classId}`);
    console.log(`User joined class-${classId}`);
  }

  @SubscribeMessage('class:leave')
  handleLeave(@ConnectedSocket() client: socketType.AuthenticatedSocket, @MessageBody() classId: string) {
    client.leave(`class-${classId}`);
  }

  @SubscribeMessage('chat:send')
  async handleSendMessage(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string; message: string },
  ) {
    const user = client.data.user;

    this.server.to(`class-${payload.classId}`).emit('chat:message', payload.message);
  }
}
