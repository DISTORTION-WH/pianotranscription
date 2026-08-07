import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [EventsGateway],
  exports: [EventsGateway], // Экспортируем, чтобы другие сервисы могли триггерить события
})
export class EventsModule {}