import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Get,
  Logger,
  NotAcceptableException,
  NotFoundException,
  Param,
  Patch,
  Post,
  PreconditionFailedException,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../application/command/impl/create-user.command';
import { CreateUserRequest } from '../dto/create-user.request';
import { match, Result } from 'oxide.ts';
import {
  AccessDeniedError,
  ConfirmEmailFailedError,
  UserAlreadyExistError,
  UserNotFoundError,
} from '../../domain/error/user.error';
import { UserResponse } from '../dto/user.response';
import { UpdateUserRequest } from '../dto/update-user.request';
import { UpdateUserCommand } from '../../application/command/impl/update-user.command';
import { IdResponse } from '../dto/id.response';
import { GetAllUsersQuery } from 'src/user/application/query/impl/get-all-users.query';
import { GetUserByIdQuery } from 'src/user/application/query/impl/get-user-by-id.query';
import { ArgumentNotProvideException } from 'src/libs/argument-not-provide.exception';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { User } from 'src/user/infrastructure/entity/user.orm-entity';
import { UserService } from 'src/user/application/user.service';
import { UserEssentialProperties } from 'src/user/domain/model/user.model';
import { AuthGuard } from 'src/user/application/guard/auth.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import RequestWithUser from 'src/libs/request-with-user';
import { ConfirmEmailCommand } from 'src/user/application/command/impl/confirm-email.command';
import { BadRequestException } from '@nestjs/common/exceptions';
import { EmailConfirmationGuard } from 'src/user/application/guard/email-confirmation.guard';
import { SetAdminRoleCommand } from 'src/user/application/command/impl/set-admin-role.command';
import RoleGuard from 'src/user/application/guard/roles.guard';
import { Roles } from 'src/user/application/decorator/roles.decorator';
import { Role } from 'src/user/application/roles.enum';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    readonly commandBus: CommandBus,
    readonly queryBus: QueryBus,
    private readonly userService: UserService,
  ) {}

  @ApiTags('user')
  @ApiBody({ type: CreateUserRequest })
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

  @ApiTags('user')
  @Get('confirm')
  async confirmEmail(@Query('token') token: string) {
    const command = new ConfirmEmailCommand(token);
    const result: Result<IdResponse, ConfirmEmailFailedError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (error) => {
        if (error instanceof ConfirmEmailFailedError)
          throw new BadRequestException(error.message);
        throw error;
      },
    });
  }

  @ApiTags('user')
  // @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(AuthGuard)
  @Get()
  @Roles(Role.User)
  async getUsers() {
    Logger.log('Getting all users .....');
    const query = new GetAllUsersQuery();
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

  @ApiTags('user')
  @UseGuards(AuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const query = new GetUserByIdQuery(id);
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

  @ApiTags('user')
  @UseGuards(AuthGuard)
  @Post('resend-confirmation-link')
  async resendConfirmationLine(@Req() req: RequestWithUser) {
    const isSent = await this.userService.sendVerificationLink(req.user.id);
    if (!isSent) {
      throw new BadRequestException('Email already confirmed');
    }
  }

  @ApiTags('user')
  @ApiBody({ type: UpdateUserRequest })
  @UseGuards(AuthGuard, EmailConfirmationGuard)
  @Patch('/:id')
  async updateUser(
    @Param('id') requestedId: string,
    @Body() data: UpdateUserRequest,
    @Req() req: RequestWithUser,
  ) {
    Logger.log(`Updating user ${req.user.name} ......`);
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

  @ApiTags('user')
  @UseGuards(AuthGuard)
  @Patch('/:id/set-admin')
  async setAdminRole(@Param('id') idUserToSet: string) {
    const command = new SetAdminRoleCommand(idUserToSet);
    const result: Result<IdResponse, UserNotFoundError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (error) => {
        if (error instanceof UserNotFoundError)
          throw new NotFoundException(error.message);
        throw error;
      },
    });
  }

  // for other microservices
  @MessagePattern({ role: 'user', cmd: 'get_user_by_email' }, Transport.TCP)
  async getUserByEmail(data: any): Promise<User> {
    Logger.log('Getting user by email ....');
    return this.userService.getOneByEmail(data.email);
  }

  @MessagePattern({ role: 'user', cmd: 'get_user_by_id' }, Transport.TCP)
  async getUserById(data: any): Promise<UserEssentialProperties> {
    return this.userService.getOneById(data.id);
  }

  @MessagePattern(
    { role: 'user', cmd: 'get_user_with_refresh_token' },
    Transport.TCP,
  )
  async getUserWithRefreshToken(data: any): Promise<User> {
    console.log(data);
    return this.userService.getHashedRefreshToken(data.id);
  }

  @MessagePattern({ role: 'user', cmd: 'save_refresh_token' }, Transport.TCP)
  async saveRefreshToken(data: any) {
    Logger.log('Saving refresh token ....');
    console.log(data);
    return this.userService.saveRefreshToken(data.id, data.hashedRefreshToken);
  }

  @MessagePattern(
    { role: 'user', cmd: 'register_with_google_account' },
    Transport.TCP,
  )
  async registerWithGoogleAccount(data: any) {
    Logger.log('Creating a new user with Google account ..........');
    const command = new CreateUserCommand(data.name, data.email);
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
}
