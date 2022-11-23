import { Controller } from '@nestjs/common';
import { Post, UseGuards, Get, Req } from '@nestjs/common/decorators';
import { Logger } from '@nestjs/common/services';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/login.request';
import { LocalGuard } from './guard/local.guard';
import { RefreshGuard } from './guard/refresh.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('hello')
  @Get()
  hello() {
    return 'Hello World';
  }

  @MessagePattern({ role: 'auth', cmd: 'check' }, Transport.TCP)
  async isLogged(data) {
    Logger.log('Checking authentication ......');
    try {
      const res = this.authService.validateToken(data.jwt);
      return res;
    } catch (error) {
      Logger.log(error);
      return false;
    }
  }

  @MessagePattern({ role: 'auth', cmd: 'is_admin' }, Transport.TCP)
  async isAdmin(data) {
    Logger.log('Checking admin role ........');
    console.log(data);
    return true;
  }

  @ApiTags('auth')
  @ApiBody({ type: LoginRequest })
  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Req() req) {
    Logger.log('Logining .......');
    const { user } = req;
    return this.authService.login(user);
  }

  @ApiTags('auth')
  @UseGuards(RefreshGuard)
  @Get('refresh')
  async refresh(@Req() req) {
    const { user } = req;
    return this.authService.refresh(user);
  }

  @ApiTags('auth')
  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth(@Req() req) {
    Logger.log('Goole auth .......');
  }

  @ApiTags('auth')
  @UseGuards(AuthGuard('google'))
  @Get('google/redirect')
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}
