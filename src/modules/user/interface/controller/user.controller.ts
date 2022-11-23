import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotAcceptableException,
  NotFoundException,
  Param,
  Patch,
  Post,
  PreconditionFailedException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserCommand } from '../../application/command/impl/create-user.command';
import { CreateUserRequest } from '../dto/create-user.request';
import { match, Result } from 'oxide.ts';
import {
  AccessDeniedError,
  UserAlreadyExistError,
  UserNotFoundError,
} from '../../domain/error/user.error';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { GetUsersQuery } from '../../application/query/impl/get-users.query';
import { UserResponse } from '../dto/user.response';
import { JwtAuthGuard } from '../../../../libs/auth/guard/jwt-auth.guard';
import { UpdateUserRequest } from '../dto/update-user.request';
import RequestWithUser from '../../../../libs/auth/request-with-user.interface';
import { UpdateUserCommand } from '../../application/command/impl/update-user.command';
import { ArgumentNotProvideException } from 'src/libs/exception/argument-not-provide.exception';
import { GetUserQuery } from '../../application/query/impl/get-user-by-id.query';

@ApiTags('auth')
@Controller('users')
export class UserController {
  constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

  @Post('register')
  async register(@Body() body: CreateUserRequest): Promise<IdResponse> {
    const command = new CreateUserCommand(body.name, body.email, body.password);
    const result: Result<IdResponse, UserAlreadyExistError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (error) => {
        if (error instanceof UserAlreadyExistError)
          throw new ConflictException(error.message);
        throw error;
      },
    });
  }

  @Get()
  async getUsers() {
    const query = new GetUsersQuery();
    const result: Result<UserResponse[], UserNotFoundError> =
      await this.queryBus.execute(query);
    return match(result, {
      Ok: (users) => users,
      Err: (error) => {
        if (error instanceof UserNotFoundError)
          throw new NotFoundException(error.message);
        throw error;
      },
    });
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const query = new GetUserQuery(id);
    const result: Result<UserResponse, UserNotFoundError> =
      await this.queryBus.execute(query);
    return match(result, {
      Ok: (user) => user,
      Err: (err) => {
        if (err instanceof UserNotFoundError)
          throw new NotFoundException(err.message);
        throw err;
      },
    });
  }

  @ApiBody({ type: UpdateUserRequest })
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateUser(
    @Param('id') requestedId: string,
    @Body() data: UpdateUserRequest,
    @Req() req: RequestWithUser,
  ) {
    const command = new UpdateUserCommand(
      req.user.id,
      data.name,
      data.password,
      requestedId,
    );
    const result: Result<
      IdResponse,
      AccessDeniedError | ArgumentNotProvideException
    > = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (error) => {
        if (error instanceof AccessDeniedError)
          throw new NotAcceptableException(error.message);
        if (error instanceof ArgumentNotProvideException)
          throw new PreconditionFailedException(error.message);
        throw error;
      },
    });
  }
}
