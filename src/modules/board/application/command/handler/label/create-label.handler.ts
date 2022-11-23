import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { HistoryFactory } from 'src/libs/factory/history.factory';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { BoardRepositoryPort } from 'src/modules/board/domain/database/board.repository.port';
import { LabelRepositoryPort } from 'src/modules/board/domain/database/label.repository.port';
import { BoardCannotAccessedError } from 'src/modules/board/domain/error/board.error';
import { LabelAlreadyExistError } from 'src/modules/board/domain/error/label.error';
import { LabelFactory } from 'src/modules/board/domain/label.factory';
import { InjectionToken } from '../../../injection.token';
import { CreateLabelCommand } from '../../impl/label/create-label.command';

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
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: CreateLabelCommand,
  ): Promise<
    Result<IdResponse, LabelAlreadyExistError | BoardCannotAccessedError>
  > {
    const isRequesterValid = await this.boardRepository.hasMember(
      command.boardId,
      command.requester.id,
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
        const history = this.historyFactory.create({
          userId: command.requester.id,
          action: 'CREATE',
          createOn: new Date(),
          boardId: command.boardId,
          message: `${command.requester.name} CREATED LABEL`,
          content: { ...command },
        });
        await this.historyRepository.save(history);
        return Ok(new IdResponse(label.getProperties().id));
      }
    } else {
      return Err(new BoardCannotAccessedError());
    }
  }
}
