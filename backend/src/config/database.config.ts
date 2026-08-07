import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  // Включаем авто-создание таблиц только для разработки. 
  // В продакшене (NODE_ENV=production) нужно использовать миграции!
  synchronize: configService.get<string>('NODE_ENV') !== 'production',
  autoLoadEntities: true, // Автоматически загружает сущности
  logging: configService.get<string>('NODE_ENV') === 'development',
});