import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { AudioTrack } from './entities/audio-track.entity';
import { QueueModule } from '../queue/queue.module'; // <-- Добавлен импорт

@Module({
  imports: [
    TypeOrmModule.forFeature([AudioTrack]),
    QueueModule, // <-- Регистрируем модуль очередей
  ],
  controllers: [AudioController],
  providers: [AudioService],
  exports: [AudioService],
})
export class AudioModule {}