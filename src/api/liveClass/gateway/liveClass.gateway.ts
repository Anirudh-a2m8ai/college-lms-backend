import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseFilters, UseGuards } from '@nestjs/common';
import { WsAccessTokenGuard } from '../../../common/guards/ws-access-token.guard';
import { WsExceptionFilter } from 'src/common/filters/ws-exception.filter';
import * as socketType from 'src/common/types/socket.type';
import { LiveClassService } from '../liveClass.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
@UseGuards(WsAccessTokenGuard)
@UseFilters(WsExceptionFilter)
export class LiveClassGateway implements OnGatewayDisconnect {
  constructor(private readonly liveClassService: LiveClassService) {}
  @WebSocketServer()
  server: Server;

  private classHosts = new Map<
    string,
    {
      socketId: string;
      userId: string;
    }
  >();

  private classMessages = new Map<string, any[]>();

  private classPolls = new Map<
    string,
    {
      pollId: string;
      question: string;
      options: { id: string; text: string; votes: number }[];
      voters: Set<string>;
      isActive: boolean;
    }
  >();

  private classState = new Map<
    string,
    {
      view?: string;
      lessonId?: string;
      strokes: any[];
      highlights: any[];
    }
  >();

  @SubscribeMessage('class:join')
  async handleJoin(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string },
  ) {
    const user = client.data.user;
    const role = user.role;

    const roomName = `class-${payload.classId}`;

    await this.liveClassService.verifyUser(user.userId, payload.classId);

    client.join(roomName);
    client.data.classId = payload.classId;

    if (role === 'instructor') {
      this.classHosts.set(payload.classId, {
        socketId: client.id,
        userId: user.userId,
      });
    }

    if (role === 'student') {
      const host = this.classHosts.get(payload.classId);
      if (host) {
        this.server.to(host.socketId).emit('webrtc:student-joined', {
          studentSocketId: client.id,
          user,
        });
      }
    }

    const messages = this.classMessages.get(payload.classId) || [];
    client.emit('chat:history', messages);

    const poll = this.classPolls.get(payload.classId);
    if (poll) {
      client.emit('poll:state', poll);
    }

    const sockets = await this.server.in(roomName).fetchSockets();
    const users = sockets.map((s) => s.data.user);
    const usersList = users.map((user) => {
      delete user.permissions;
      return user;
    });

    this.server.to(roomName).emit('class:users', usersList);
  }

  @SubscribeMessage('class:leave')
  async handleLeave(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string },
  ) {
    const roomName = `class-${payload.classId}`;

    client.leave(roomName);

    if (client.data.user.role === 'student') {
      const host = this.classHosts.get(payload.classId);
      if (host) {
        this.server.to(host.socketId).emit('webrtc:student-left', {
          studentSocketId: client.id,
        });
      }
    }

    const sockets = await this.server.in(roomName).fetchSockets();
    const users = sockets.map((s) => s.data.user);

    this.server.to(roomName).emit('class:users', users);
  }

  @SubscribeMessage('chat:send')
  handleSendMessage(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string; message: string },
  ) {
    const user = client.data.user;
    const roomName = `class-${payload.classId}`;

    const msg = {
      userId: user.userId,
      message: payload.message,
      timestamp: new Date(),
    };

    if (!this.classMessages.has(payload.classId)) {
      this.classMessages.set(payload.classId, []);
    }

    const messages = this.classMessages.get(payload.classId)!;

    messages.push(msg);

    if (messages.length > 100) {
      messages.shift();
    }

    this.server.to(roomName).emit('chat:message', msg);
  }

  @SubscribeMessage('poll:create')
  handleCreatePoll(@MessageBody() payload: { classId: string; question: string; options: string[] }) {
    const roomName = `class-${payload.classId}`;
    const poll = {
      pollId: crypto.randomUUID(),
      question: payload.question,
      options: payload.options.map((opt) => ({
        id: crypto.randomUUID(),
        text: opt,
        votes: 0,
      })),
      voters: new Set<string>(),
      isActive: true,
    };

    this.classPolls.set(payload.classId, poll);

    this.server.to(roomName).emit('poll:created', poll);
  }

  @SubscribeMessage('poll:vote')
  handleVote(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string; optionId: string },
  ) {
    const user = client.data.user;
    const roomName = `class-${payload.classId}`;
    const poll = this.classPolls.get(payload.classId);

    if (!poll || !poll.isActive) return;

    if (poll.voters.has(user.userId)) return;

    const option = poll.options.find((o) => o.id === payload.optionId);
    if (!option) return;

    option.votes += 1;
    poll.voters.add(user.userId);

    this.server.to(roomName).emit('poll:updated', poll);
  }

  @SubscribeMessage('poll:end')
  handleEndPoll(@MessageBody() payload: { classId: string }) {
    const roomName = `class-${payload.classId}`;
    const poll = this.classPolls.get(payload.classId);
    if (!poll) return;

    poll.isActive = false;

    this.server.to(roomName).emit('poll:ended', poll);
  }

  @SubscribeMessage('webrtc:offer')
  handleOffer(@ConnectedSocket() client: Socket, @MessageBody() payload: { target: string; offer: any }) {
    this.server.to(payload.target).emit('webrtc:offer', {
      offer: payload.offer,
      from: client.id,
    });
  }

  @SubscribeMessage('webrtc:answer')
  handleAnswer(@ConnectedSocket() client: Socket, @MessageBody() payload: { target: string; answer: any }) {
    this.server.to(payload.target).emit('webrtc:answer', {
      answer: payload.answer,
      from: client.id,
    });
  }

  @SubscribeMessage('webrtc:ice-candidate')
  handleIceCandidate(@ConnectedSocket() client: Socket, @MessageBody() payload: { target: string; candidate: any }) {
    this.server.to(payload.target).emit('webrtc:ice-candidate', {
      candidate: payload.candidate,
      from: client.id,
    });
  }

  @SubscribeMessage('webrtc:unmute-student')
  handleUnmute(@MessageBody() payload: { studentSocketId: string }) {
    this.server.to(payload.studentSocketId).emit('webrtc:unmute-request');
  }
  @SubscribeMessage('class:end')
  handleEndClass(@MessageBody() payload: { classId: string }) {
    const roomName = `class-${payload.classId}`;

    this.server.to(roomName).emit('class:ended');
    this.classHosts.delete(payload.classId);
    this.classMessages.delete(payload.classId);
    this.classPolls.delete(payload.classId);
  }

  async handleDisconnect(client: Socket) {
    const classId = client.data?.classId;
    const role = client.data?.role;

    if (!classId) return;

    const roomName = `class-${classId}`;

    if (role === 'host') {
      this.server.to(roomName).emit('class:ended');
      this.classHosts.delete(classId);
      this.classMessages.delete(classId);
      this.classPolls.delete(classId);
    }

    if (role === 'student') {
      const host = this.classHosts.get(classId);
      if (host) {
        this.server.to(host.socketId).emit('webrtc:student-left', {
          studentSocketId: client.id,
        });
      }
    }

    const sockets = await this.server.in(roomName).fetchSockets();
    const users = sockets.map((s) => s.data.user);

    this.server.to(roomName).emit('class:users', users);
  }

  @SubscribeMessage('change-view')
  async handleChangeView(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string; view: string },
  ) {
    const user = client.data.user;
    const roomName = `class-${payload.classId}`;
    if (user.userId !== this.classHosts.get(payload.classId)?.userId) return;
    const state = this.getOrCreateState(payload.classId);
    state.view = payload.view;
    this.server.to(roomName).emit('view-changed', payload.view);
  }

  @SubscribeMessage('change-lesson')
  async handleChangeLesson(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string; lessonId: string },
  ) {
    const user = client.data.user;
    const roomName = `class-${payload.classId}`;
    if (user.userId !== this.classHosts.get(payload.classId)?.userId) return;
    const state = this.getOrCreateState(payload.classId);
    state.lessonId = payload.lessonId;
    this.server.to(roomName).emit('lesson-changed', payload.lessonId);
  }

  @SubscribeMessage('draw-stroke')
  async handleDrawStroke(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string; stroke: any },
  ) {
    const user = client.data.user;
    const roomName = `class-${payload.classId}`;
    if (user.userId !== this.classHosts.get(payload.classId)?.userId) return;
    const state = this.getOrCreateState(payload.classId);
    state.strokes.push(payload.stroke);
    this.server.to(roomName).emit('new-stroke', payload.stroke);
  }

  @SubscribeMessage('clear-board')
  async handleClearBoard(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string },
  ) {
    const user = client.data.user;
    const roomName = `class-${payload.classId}`;
    if (user.userId !== this.classHosts.get(payload.classId)?.userId) return;
    const state = this.getOrCreateState(payload.classId);
    state.strokes = [];
    state.highlights = [];
    this.server.to(roomName).emit('board-cleared');
  }

  @SubscribeMessage('content-highlight')
  async handleContentHighlight(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string; content: any },
  ) {
    const user = client.data.user;
    const roomName = `class-${payload.classId}`;
    if (user.userId !== this.classHosts.get(payload.classId)?.userId) return;
    this.server.to(roomName).emit('content-highlighted', payload.content);
  }

  @SubscribeMessage('raise-hand')
  async handleRaiseHand(
    @ConnectedSocket() client: socketType.AuthenticatedSocket,
    @MessageBody() payload: { classId: string; isRaised: boolean },
  ) {
    const user = client.data.user;
    const roomName = `class-${payload.classId}`;
    this.server.to(roomName).emit('raise-hand', payload);
  }

  private getOrCreateState(classId: string) {
    if (!this.classState.has(classId)) {
      this.classState.set(classId, {
        strokes: [],
        highlights: [],
      });
    }
    return this.classState.get(classId)!;
  }
}
