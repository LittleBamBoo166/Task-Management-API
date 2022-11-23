import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateListCommand } from '../../impl/list/create-list.command';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { ListAlreadyExistError } from 'src/modules/board/domain/error/list.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { ListRepositoryPort } from 'src/modules/board/domain/database/list.repository.port';
import { ListFactory } from 'src/modules/board/domain/list.factory';
import { BoardRepositoryPort } from 'src/modules/board/domain/database/board.repository.port';
import { BoardCannotAccessedError } from 'src/modules/board/domain/error/board.error';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { HistoryFactory } from 'src/libs/factory/history.factory';

@CommandHandler(CreateListCommand)
export class CreateListHandler
  implements
    ICommandHandler<
      CreateListCommand,
      Result<IdResponse, ListAlreadyExistError | BoardCannotAccessedError>
    >
{
  constructor(
    @Inject(InjectionToken.LIST_REPOSITORY)
    private listRepository: ListRepositoryPort,
    @Inject(InjectionToken.BOARD_REPOSITORY)
    private boardRepository: BoardRepositoryPort,
    private readonly listFactory: ListFactory,
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: CreateListCommand,
  ): Promise<
    Result<IdResponse, ListAlreadyExistError | BoardCannotAccessedError>
  > {
    const isRequesterValid = await this.boardRepository.hasMember(
      command.boardId,
      command.requester.id,
    );
    if (isRequesterValid) {
      const hasLists = await this.listRepository.exists(
        command.name,
        command.boardId,
      );
      if (hasLists) {
        return Err(new ListAlreadyExistError());
      } else {
        const list = this.listFactory.create(
          command.name,
          command.color,
          command.order,
        );
        await this.listRepository.save(list, command.boardId);
        const history = this.historyFactory.create({
          userId: command.requester.id,
          action: 'CREATE',
          createOn: new Date(),
          boardId: command.boardId,
          message: `${command.requester.name} CREATED LIST`,
          content: { ...command },
        });
        await this.historyRepository.save(history);
        return Ok(new IdResponse(list.getProperties().id));
      }
    } else {
      return Err(new BoardCannotAccessedError());
    }
  }
}
