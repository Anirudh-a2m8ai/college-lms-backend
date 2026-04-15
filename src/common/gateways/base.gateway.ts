import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';

export class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
