import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USER', 'piano'),
  password: configService.get<string>('DB_PASSWORD', 'piano_dev_password'),
  database: configService.get<string>('DB_NAME', 'piano_transcription'),
  // Включаем авто-создание таблиц только для разработки. 
  // В продакшене (NODE_ENV=production) нужно использовать миграции!
  synchronize: configService.get<string>('NODE_ENV') !== 'production',
  autoLoadEntities: true, // Автоматически загружает сущности
  logging: configService.get<string>('NODE_ENV') === 'development',
});
