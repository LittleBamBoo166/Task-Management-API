import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { BoardRepositoryPort } from 'src/board/domain/database/board.repository.port';
import { LabelRepositoryPort } from 'src/board/domain/database/label.repository.port';
import { BoardCannotAccessedError } from 'src/board/domain/error/board.error';
import { InjectionToken } from '../../../injection.token';
import { DeleteLabelCommand } from '../../impl/label/delete-label.command';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

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
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: DeleteLabelCommand,
  ): Promise<Result<IdResponse, BoardCannotAccessedError>> {
    const isRequesterValid = await this.boardRepository.hasMember(
      command.boardId,
      command.requesterId,
    );
    if (isRequesterValid) {
      await this.labelRepository.delete(command.id, command.boardId);
      const historyObject: CreateHistoryObject = {
        userId: command.requesterId,
        boardId: command.boardId,
        action: 'DELETE',
        message: 'deleted a label',
        changedContent: {
          id: command.id,
        },
      };
      const historyEntity = this.historyService.create(historyObject);
      await this.historyService.save(historyEntity);
      return Ok(new IdResponse(command.id));
    } else {
      return Err(new BoardCannotAccessedError());
    }
  }
}
