import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
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
import { JwtAuthGuard } from 'src/libs/auth/guard/jwt-auth.guard';
import { match, Result } from 'oxide.ts';
import { CreateTaskRequest } from '../dto/task/create-task.request';
import RequestWithUser from 'src/libs/auth/request-with-user.interface';
import { CreateTaskCommand } from '../../application/command/impl/task/create-task.command';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import {
  CannotMoveTaskError,
  InvalidDueDateError,
  InvalidLabelError,
  InvalidMemberError,
  LabelAlreadyExistError,
  LabelNotFoundError,
  TaskMemberNotFound,
  TaskNotFoundError,
} from '../../domain/error/task.error';
import { UpdateTaskRequest } from '../dto/task/update-task.request';
import { UpdateTaskCommand } from '../../application/command/impl/task/update-task.command';
import { MoveTaskCommand } from '../../application/command/impl/task/move-task.command';
import { MoveTaskRequest } from '../dto/task/move-task.request';
import { DeleteTaskCommand } from '../../application/command/impl/task/delete-task.command';
import { UpdateDueDateRequest } from '../dto/task/update-due-date.request';
import { UpdateDueDateCommand } from '../../application/command/impl/task/update-due-date.command';
import { GetTaskByIdQuery } from '../../application/query/impl/get-task-by-id.query';
import { TaskResponse } from '../dto/task.response';
import { GetTaskByListIdQuery } from '../../application/query/impl/get-tasks-by-board-id.query';
import { AddTaskMemberRequest } from '../dto/task/add-task-member.request';
import { AddTaskMemberCommand } from '../../application/command/impl/task/add-task-member.command';
import { AssignTaskMemberRequest } from '../dto/task/assign-task-member.request';
import { AssignTaskMemberCommand } from '../../application/command/impl/task/assign-task-member.command';
import { GetHistoryQuery } from '../../application/query/impl/get-history.query';
import { History } from 'src/infrastructure/entity/history.orm-entity';
import { AddTaskLabelRequest } from '../dto/task/add-task-label.request';
import { AddTaskLabelCommand } from '../../application/command/impl/task/add-task-label.command';
import { TaskResponseWithDetail } from '../dto/task.response-with-detail';
import { RemoveTaskLabelRequest } from '../dto/task/remove-task-label.request';
import { RemoveTaskLabelCommand } from '../../application/command/impl/task/remove-task-label.command';
import { RemoveTaskMemberRequest } from '../dto/task/remove-task-member.request';
import { RemoveTaskMemberCommand } from '../../application/command/impl/task/remove-task-member.command';
import { ListNotFoundError } from 'src/modules/board/domain/error/list.error';

@ApiTags('task')
@UseGuards(JwtAuthGuard)
@Controller()
export class TaskController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiBody({ type: CreateTaskRequest })
  @Post('tasks')
  async createTask(
    @Req() req: RequestWithUser,
    @Body() data: CreateTaskRequest,
  ) {
    const command = new CreateTaskCommand(
      req.user,
      data.listId,
      data.name,
      data.dueDate,
      data.priority,
      data.order,
    );
    const result: Result<IdResponse, ListNotFoundError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof ListNotFoundError)
          throw new ConflictException(err.message);
        throw err;
      },
    });
  }

  @ApiBody({ type: UpdateTaskRequest })
  @Patch('tasks/:id')
  async updateTask(
    @Req() req: RequestWithUser,
    @Param('id') taskId: string,
    @Body() data: UpdateTaskRequest,
  ) {
    const command = new UpdateTaskCommand(taskId, req.user, { ...data });
    const result: Result<IdResponse, TaskNotFoundError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof TaskNotFoundError)
          throw new NotFoundException(err.message);
        throw err;
      },
    });
  }

  @ApiBody({ type: MoveTaskRequest })
  @Patch('tasks/:id/move')
  async moveTask(
    @Req() req: RequestWithUser,
    @Param('id') taskId: string,
    @Body() data: MoveTaskRequest,
  ) {
    const command = new MoveTaskCommand(
      taskId,
      req.user,
      data.listId,
      data.order,
    );
    const result: Result<IdResponse, TaskNotFoundError | CannotMoveTaskError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof TaskNotFoundError)
          throw new NotFoundException(err.message);
        if (err instanceof CannotMoveTaskError)
          throw new BadRequestException(err.message);
        throw err;
      },
    });
  }

  @ApiBody({ type: UpdateDueDateRequest })
  @Patch('tasks/:id/changeDueDate')
  async updateDueDate(
    @Req() req: RequestWithUser,
    @Param('id') taskId: string,
    @Body() data: UpdateDueDateRequest,
  ) {
    const command = new UpdateDueDateCommand(taskId, req.user, data.dueDate);
    const result: Result<IdResponse, TaskNotFoundError | InvalidDueDateError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof TaskNotFoundError)
          throw new NotFoundException(err.message);
        if (err instanceof InvalidDueDateError)
          throw new PreconditionFailedException(err.message);
        throw err;
      },
    });
  }

  @Delete('tasks/:id')
  async deleteTask(@Req() req: RequestWithUser, @Param('id') taskId: string) {
    const command = new DeleteTaskCommand(taskId, req.user);
    const result: Result<IdResponse, TaskNotFoundError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof TaskNotFoundError)
          throw new NotFoundException(err.message);
        throw err;
      },
    });
  }

  @Get('lists/:id/tasks')
  async GetTaskByListId(
    @Req() req: RequestWithUser,
    @Param('id') boardId: string,
  ) {
    const query = new GetTaskByListIdQuery(boardId, req.user.id);
    const result: Result<TaskResponse[], TaskNotFoundError> =
      await this.queryBus.execute(query);
    return match(result, {
      Ok: (tasks) => tasks,
      Err: (err) => {
        if (err instanceof TaskNotFoundError)
          throw new NotFoundException(err.message);
        throw err;
      },
    });
  }

  @Get('tasks/:id')
  async getTaskById(@Req() req: RequestWithUser, @Param('id') taskId: string) {
    const query = new GetTaskByIdQuery(taskId, req.user.id);
    const result: Result<TaskResponseWithDetail, TaskNotFoundError> =
      await this.queryBus.execute(query);
    return match(result, {
      Ok: (task) => task,
      Err: (err) => {
        if (err instanceof TaskNotFoundError)
          throw new NotFoundException(err.message);
        throw err;
      },
    });
  }

  @ApiBody({ type: AddTaskMemberRequest })
  @Patch('tasks/:id/add-member')
  async addTaskMember(
    @Req() req: RequestWithUser,
    @Param('id') taskId: string,
    @Body() data: AddTaskMemberRequest,
  ) {
    const command = new AddTaskMemberCommand(taskId, req.user, data.memberId);
    const result: Result<IdResponse, TaskNotFoundError | InvalidMemberError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof TaskNotFoundError)
          throw new NotFoundException(err.message);
        if (err instanceof InvalidMemberError)
          throw new ConflictException(err.message);
        throw err;
      },
    });
  }

  @ApiBody({ type: AssignTaskMemberRequest })
  @Patch('tasks/:id/assign-member')
  async assignTaskMember(
    @Req() req: RequestWithUser,
    @Param('id') taskId: string,
    @Body() data: AssignTaskMemberRequest,
  ) {
    const command = new AssignTaskMemberCommand(
      taskId,
      req.user,
      data.memberId,
    );
    const result: Result<IdResponse, TaskNotFoundError | InvalidMemberError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof TaskNotFoundError)
          throw new NotFoundException(err.message);
        if (err instanceof InvalidMemberError)
          throw new ConflictException(err.message);
        throw err;
      },
    });
  }

  @ApiBody({ type: AddTaskLabelRequest })
  @Patch('tasks/:id/add-label')
  async addTaskLabel(
    @Req() req: RequestWithUser,
    @Param('id') taskId: string,
    @Body() data: AddTaskLabelRequest,
  ) {
    const command = new AddTaskLabelCommand(taskId, req.user, data.labelId);
    const result: Result<
      IdResponse,
      TaskNotFoundError | InvalidLabelError | LabelAlreadyExistError
    > = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof TaskNotFoundError)
          throw new NotFoundException(err.message);
        if (
          err instanceof InvalidLabelError ||
          err instanceof LabelAlreadyExistError
        )
          throw new ConflictException(err.message);
        throw err;
      },
    });
  }

  @ApiBody({ type: RemoveTaskLabelRequest })
  @Patch('tasks/:id/remove-label')
  async removeTaskLabel(
    @Req() req: RequestWithUser,
    @Param('id') taskId: string,
    @Body() data: RemoveTaskLabelRequest,
  ) {
    const command = new RemoveTaskLabelCommand(taskId, req.user, data.labelId);
    const result: Result<IdResponse, TaskNotFoundError | LabelNotFoundError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (
          err instanceof TaskNotFoundError ||
          err instanceof LabelNotFoundError
        )
          throw new NotFoundException(err.message);
        throw err;
      },
    });
  }

  @ApiBody({ type: RemoveTaskMemberRequest })
  @Patch('tasks/:id/remove-member')
  async removeTaskMember(
    @Req() req: RequestWithUser,
    @Param('id') taskId: string,
    @Body() data: RemoveTaskMemberRequest,
  ) {
    const command = new RemoveTaskMemberCommand(
      taskId,
      req.user,
      data.memberId,
    );
    const result: Result<IdResponse, TaskNotFoundError | TaskMemberNotFound> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (
          err instanceof TaskNotFoundError ||
          err instanceof TaskMemberNotFound
        )
          throw new NotFoundException(err.message);
        throw err;
      },
    });
  }

  @Get(':id/history')
  async getTaskHistory(@Req() req: RequestWithUser, @Param('id') id: string) {
    const query = new GetHistoryQuery(id, req.user);
    const result: Result<History, TaskNotFoundError> =
      await this.queryBus.execute(query);
    return match(result, {
      Ok: (history) => history,
      Err: (err) => {
        if (err instanceof TaskNotFoundError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }
}
