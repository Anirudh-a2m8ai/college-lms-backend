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
import { RedisService } from 'src/redis/redis.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
@UseGuards(WsAccessTokenGuard)
@UseFilters(WsExceptionFilter)
export class LiveClassGateway extends BaseGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly service: LiveClassService,
    private readonly redisService: RedisService,
  ) {
    super();
  }

  @SubscribeMessage('class:join')
  async handleJoin(@ConnectedSocket() client: socketType.AuthenticatedSocket, @MessageBody() classId: string) {
    const user = client.data.user;
    const userId = user.userId;
    const roomName = `class-${classId}`;
    const userSetKey = `class:${classId}:userIds`;
    const userHashKey = `class:${classId}:users`;

    await this.service.joinLiveClass(classId, userId);

    client.join(roomName);

    client.data.classId = classId;

    await this.redisService.addToSet(userSetKey, userId);

    await this.redisService.setHash(userHashKey, userId, JSON.stringify(user));

    await this.redisService.setExpiry(userSetKey, 7200);
    await this.redisService.setExpiry(userHashKey, 7200);

    const usersObj = await this.redisService.getAllHash(userHashKey);

    const users = Object.values(usersObj).map((u) => JSON.parse(u));

    console.log(`User ${userId} joined ${roomName}`);

    this.server.to(roomName).emit('class:users', users);
  }

  @SubscribeMessage('class:leave')
  async handleLeave(@ConnectedSocket() client: socketType.AuthenticatedSocket, @MessageBody() classId: string) {
    const user = client.data.user;
    const userId = user?.userId;

    if (!userId) return;

    const roomName = `class-${classId}`;

    const userSetKey = `class:${classId}:userIds`;
    const userHashKey = `class:${classId}:users`;

    client.leave(roomName);

    await this.redisService.removeFromSet(userSetKey, userId);

    await this.redisService.deleteFromHash(userHashKey, userId);

    const usersObj = await this.redisService.getAllHash(userHashKey);

    const users = Object.values(usersObj).map((u) => JSON.parse(u));

    console.log(`User ${userId} left ${roomName}`);

    this.server.to(roomName).emit('class:users', users);
  }

  @SubscribeMessage('chat:send')
  async handleSendMessage(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string; message: string },
  ) {
    const user = client.data.user;

    this.server.to(`class-${payload.classId}`).emit('chat:message', payload.message);
  }

  @SubscribeMessage('change-view')
  async handleChangeView(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string; view: string },
  ) {
    const user = client.data.user;

    this.server.to(`class-${payload.classId}`).emit('view-changed', payload.view);
  }

  @SubscribeMessage('change-lesson')
  async handleChangeLesson(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string; lessonId: string },
  ) {
    const user = client.data.user;

    this.server.to(`class-${payload.classId}`).emit('lesson-changed', payload.lessonId);
  }

  @SubscribeMessage('draw-stroke')
  async handleDrawStroke(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string; stroke: any },
  ) {
    const user = client.data.user;

    this.server.to(`class-${payload.classId}`).emit('new-stroke', payload.stroke);
  }

  @SubscribeMessage('clear-board')
  async handleClearBoard(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string },
  ) {
    const user = client.data.user;

    this.server.to(`class-${payload.classId}`).emit('board-cleared');
  }

  @SubscribeMessage('create-poll')
  async handleCreatePoll(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string; poll: any },
  ) {
    const user = client.data.user;

    this.server.to(`class-${payload.classId}`).emit('poll-created', payload.poll);
  }

  @SubscribeMessage('cast-vote')
  async handleCastVote(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string; vote: any },
  ) {
    const user = client.data.user;

    this.server.to(`class-${payload.classId}`).emit('vote-cast', payload.vote);
  }

  @SubscribeMessage('content-highlight')
  async handleContentHighlight(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string; content: any },
  ) {
    const user = client.data.user;

    this.server.to(`class-${payload.classId}`).emit('content-highlighted', payload.content);
  }

  @SubscribeMessage('raise-hand')
  async handleRaiseHand(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string; isRaised: boolean },
  ) {
    const user = client.data.user;

    this.server.to(`class-${payload.classId}`).emit('raise-hand', payload);
  }
}
