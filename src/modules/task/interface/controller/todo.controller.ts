import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Result, match } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { TaskNotFoundError } from 'src/modules/task/domain/error/task.error';
import { JwtAuthGuard } from 'src/libs/auth/guard/jwt-auth.guard';
import RequestWithUser from 'src/libs/auth/request-with-user.interface';
import { CreateTodoCommand } from '../../application/command/impl/todo/create-todo.command';
import { DeleteTodoCommand } from '../../application/command/impl/todo/delete-todo.command';
import { UpdateTodoCommand } from '../../application/command/impl/todo/update-todo.command';
import {
  TodoAlreadyExistError,
  TodoNotFoundError,
} from '../../domain/error/todo.error';
import { CreateTodoRequest } from '../dto/todo/create-todo.request';
import { UpdateTodoRequest } from '../dto/todo/update-todo.request';

@ApiTags('todo')
@UseGuards(JwtAuthGuard)
@Controller('tasks/:id/todos')
export class TodoController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiBody({ type: CreateTodoRequest })
  @Post()
  async createTodo(
    @Req() req: RequestWithUser,
    @Param('id') taskId: string,
    @Body() data: CreateTodoRequest,
  ) {
    const command = new CreateTodoCommand(
      data.name,
      taskId,
      req.user,
      data.parentTodoId,
    );
    const result: Result<
      IdResponse,
      TodoAlreadyExistError | TaskNotFoundError
    > = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof TodoAlreadyExistError)
          throw new ConflictException(err.message);
        if (err instanceof TaskNotFoundError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }

  @ApiBody({ type: UpdateTodoRequest })
  @Patch(':todoId')
  async updateTodo(
    @Req() req: RequestWithUser,
    @Param('id') taskId: string,
    @Param('todoId') todoId: string,
    @Body() data: UpdateTodoRequest,
  ) {
    const command = new UpdateTodoCommand(
      todoId,
      taskId,
      req.user,
      data.name,
      data.parentTodoId,
      data.checked,
    );
    const result: Result<IdResponse, TodoNotFoundError | TaskNotFoundError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof TodoNotFoundError)
          throw new ConflictException(err.message);
        if (err instanceof TaskNotFoundError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }

  @Delete(':todoId')
  async deleteTodo(
    @Req() req: RequestWithUser,
    @Param('id') taskId: string,
    @Param('todoId') todoId: string,
  ) {
    const command = new DeleteTodoCommand(todoId, taskId, req.user);
    const result: Result<IdResponse, TodoNotFoundError | TaskNotFoundError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof TodoNotFoundError)
          throw new ConflictException(err.message);
        if (err instanceof TaskNotFoundError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }
}
