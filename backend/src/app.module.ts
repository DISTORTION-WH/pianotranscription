import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AudioModule } from './audio/audio.module';
import { QueueModule } from './queue/queue.module';
import { AiModule } from './ai/ai.module';
import { EventsModule } from './events/events.module'; // <-- Добавлен импорт

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    UsersModule,
    AuthModule,
    AudioModule,
    QueueModule,
    AiModule,
    EventsModule, // <-- Зарегистрирован
  ],
})
export class AppModule {}