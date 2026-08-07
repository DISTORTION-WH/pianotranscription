import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ML_WORKER_SERVICE', // Уникальный токен для инъекции
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          type: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL', 'amqp://guest:guest@localhost:5672')],
            queue: 'audio_processing_queue', // Имя очереди
            queueOptions: {
              durable: true, // Очередь сохраняется при перезапуске брокера
            },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule], // Экспортируем, чтобы использовать в других модулях (например, в AudioModule)
})
export class QueueModule {}