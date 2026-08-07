import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateOAuthLogin(profile: any): Promise<string> {
    try {
      // Ищем пользователя по email, полученному от провайдера
      let user = await this.usersRepository.findOne({ where: { email: profile.email } });
      
      // Если это первый вход — создаем аккаунт
      if (!user) {
        user = this.usersRepository.create({
          email: profile.email,
          displayName: profile.name,
          oauthProvider: profile.provider, 
          oauthId: profile.id,
        });
        await this.usersRepository.save(user);
      }

      // Генерируем JWT токен для общения с нашим API
      const payload = { sub: user.id, email: user.email };
      return this.jwtService.sign(payload);
    } catch (error) {
      throw new Error('OAuth Validation failed');
    }
  }
}