import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { HistoryFactory } from 'src/libs/factory/history.factory';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { BoardRepositoryPort } from 'src/modules/board/domain/database/board.repository.port';
import { LabelRepositoryPort } from 'src/modules/board/domain/database/label.repository.port';
import { BoardCannotAccessedError } from 'src/modules/board/domain/error/board.error';
import { InjectionToken } from '../../../injection.token';
import { DeleteLabelCommand } from '../../impl/label/delete-label.command';

@CommandHandler(DeleteLabelCommand)
export class DeleteLabelHandler
  implements
    ICommandHandler<
      DeleteLabelCommand,
      Result<IdResponse, BoardCannotAccessedError>
    >
{
  constructor(
    @Inject(InjectionToken.LABEL_REPOSITORY)
    private readonly labelRepository: LabelRepositoryPort,
    @Inject(InjectionToken.BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepositoryPort,
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: DeleteLabelCommand,
  ): Promise<Result<IdResponse, BoardCannotAccessedError>> {
    const isRequesterValid = await this.boardRepository.hasMember(
      command.boardId,
      command.requester.id,
    );
    if (isRequesterValid) {
      await this.labelRepository.delete(command.id, command.boardId);
      const history = this.historyFactory.create({
        userId: command.requester.id,
        action: 'DELETE',
        createOn: new Date(),
        boardId: command.boardId,
        message: `${command.requester.name} DELETED LABEL`,
        content: { ...command },
      });
      await this.historyRepository.save(history);
      return Ok(new IdResponse(command.id));
    } else {
      return Err(new BoardCannotAccessedError());
    }
  }
}
