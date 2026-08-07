import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/transcription',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  
  private readonly logger = new Logger(EventsGateway.name);

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // Извлекаем токен из заголовков или query-параметров
      const token = client.handshake.auth.token || client.handshake.query.token;
      if (!token) throw new Error('No token provided');

      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // Присоединяем сокет к персональной комнате пользователя
      client.join(`user_${userId}`);
      this.logger.log(`Client connected: ${client.id} for User: ${userId}`);
    } catch (error) {
      this.logger.error(`Unauthorized connection attempt: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Метод, который будут вызывать другие сервисы (например, когда придет ответ из RabbitMQ)
  sendTranscriptionUpdate(userId: string, trackId: string, status: string, midiUrl?: string) {
    this.server.to(`user_${userId}`).emit('transcription_status_update', {
      trackId,
      status,
      midiUrl,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Sent update to user_${userId} for track ${trackId}: ${status}`);
  }
}