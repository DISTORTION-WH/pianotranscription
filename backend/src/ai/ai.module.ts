import { Module } from '@nestjs/common';
import { AiService } from './ai.service';

@Module({
  providers: [AiService],
  exports: [AiService], // Экспортируем для использования в консьюмерах RabbitMQ
})
export class AiModule {}