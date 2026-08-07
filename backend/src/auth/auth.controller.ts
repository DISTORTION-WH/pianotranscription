import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth 2.0 login' })
  async googleAuth(@Req() req) {
    // Всю работу делает Passport.js, перенаправляя пользователя на страницу Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth 2.0 callback endpoint' })
  async googleAuthRedirect(@Req() req, @Res() res) {
    // req.user содержит данные профиля (нужно будет настроить GoogleStrategy)
    const jwt = await this.authService.validateOAuthLogin(req.user);
    
    // Перенаправляем на клиентское приложение с токеном
    const clientUrl = this.configService.get<string>('CLIENT_URL', 'http://localhost:3000');
    res.redirect(`${clientUrl}/dashboard?token=${jwt}`);
  }
}