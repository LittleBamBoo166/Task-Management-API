import {
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { match, Result } from 'oxide.ts';
import { LoginCommand } from '../../application/command/impl/login.command';
import { UserNotFoundError } from '../../domain/error/user.error';
import { LocalAuthGuard } from '../../../../libs/auth/guard/local-auth.guard';
import RequestWithUser from '../../../../libs/auth/request-with-user.interface';
import { LoginRequest } from '../dto/login.request';
import { LoginResponse } from '../dto/login.response';
import { JwtRefreshGuard } from '../../../../libs/auth/guard/jwt-refresh.guard';
import { RefreshQuery } from '../../application/query/impl/refresh.query';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

  @ApiBody({ type: LoginRequest })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser) {
    const { user } = req;
    const command = new LoginCommand(user.email, user.password);
    const result: Result<LoginResponse, UserNotFoundError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (res) => res,
      Err: (err) => {
        if (err instanceof UserNotFoundError)
          throw new NotFoundException(err.message);
        throw err;
      },
    });
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() req: RequestWithUser) {
    const { user } = req;
    const query = new RefreshQuery(user.id);
    return this.queryBus.execute(query);
  }
}
