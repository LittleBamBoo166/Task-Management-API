import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { BoardRepositoryPort } from 'src/board/domain/database/board.repository.port';
import { LabelRepositoryPort } from 'src/board/domain/database/label.repository.port';
import { BoardCannotAccessedError } from 'src/board/domain/error/board.error';
import { LabelAlreadyExistError } from 'src/board/domain/error/label.error';
import { LabelFactory } from 'src/board/domain/label.factory';
import { InjectionToken } from '../../../injection.token';
import { CreateLabelCommand } from '../../impl/label/create-label.command';
import { CreateHistoryObject } from 'src/history/history.type';
import { HistoryService } from 'src/history/history.service';

@CommandHandler(CreateLabelCommand)
export class CreateLabelHandler
  implements
    ICommandHandler<
      CreateLabelCommand,
      Result<IdResponse, LabelAlreadyExistError | BoardCannotAccessedError>
    >
{
  constructor(
    @Inject(InjectionToken.LABEL_REPOSITORY)
    private readonly labelRepository: LabelRepositoryPort,
    @Inject(InjectionToken.BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepositoryPort,
    private readonly labelFactory: LabelFactory,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: CreateLabelCommand,
  ): Promise<
    Result<IdResponse, LabelAlreadyExistError | BoardCannotAccessedError>
  > {
    const isRequesterValid = await this.boardRepository.hasMember(
      command.boardId,
      command.requesterId,
    );
    if (isRequesterValid) {
      const hasLabels = await this.labelRepository.exists(
        command.name,
        command.boardId,
      );
      if (hasLabels) {
        return Err(new LabelAlreadyExistError());
      } else {
        const label = this.labelFactory.create(command.name, command.color);
        await this.labelRepository.save(label, command.boardId);
        const historyObject: CreateHistoryObject = {
          userId: command.requesterId,
          boardId: command.boardId,
          action: 'CREATE',
          message: 'created a new label',
          changedContent: {
            name: command.name,
            color: command.color,
          },
        };
        const historyEntity = this.historyService.create(historyObject);
        await this.historyService.save(historyEntity);
        return Ok(new IdResponse(label.getProperties().id));
      }
    } else {
      return Err(new BoardCannotAccessedError());
    }
  }
}
