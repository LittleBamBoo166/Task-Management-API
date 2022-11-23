import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { ArgumentNotProvideException } from 'src/libs/exception/argument-not-provide.exception';
import { HistoryFactory } from 'src/libs/factory/history.factory';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { Checking } from 'src/libs/util/checking';
import { BoardRepositoryPort } from 'src/modules/board/domain/database/board.repository.port';
import { LabelRepositoryPort } from 'src/modules/board/domain/database/label.repository.port';
import { BoardCannotAccessedError } from 'src/modules/board/domain/error/board.error';
import {
  LabelAlreadyExistError,
  LabelNotFoundError,
} from 'src/modules/board/domain/error/label.error';
import { InjectionToken } from '../../../injection.token';
import { UpdateLabelCommand } from '../../impl/label/update-label.command';

@CommandHandler(UpdateLabelCommand)
export class UpdateLabelHandler
  implements
    ICommandHandler<
      UpdateLabelCommand,
      Result<
        IdResponse,
        | LabelNotFoundError
        | ArgumentNotProvideException
        | BoardCannotAccessedError
        | LabelAlreadyExistError
      >
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
    command: UpdateLabelCommand,
  ): Promise<
    Result<
      IdResponse,
      | LabelNotFoundError
      | ArgumentNotProvideException
      | BoardCannotAccessedError
      | LabelAlreadyExistError
    >
  > {
    const isRequesterValid = await this.boardRepository.hasMember(
      command.boardId,
      command.requester.id,
    );
    if (isRequesterValid) {
      const isArgumentsProvided =
        !Checking.isEmpty(command.name) || !Checking.isEmpty(command.color);
      if (isArgumentsProvided) {
        const label = await this.labelRepository.getOneById(
          command.id,
          command.boardId,
        );
        if (Checking.isEmpty(label)) {
          return Err(new LabelNotFoundError());
        } else {
          const isLabelNameValid =
            !Checking.isEmpty(command.name) &&
            (await this.labelRepository.exists(command.name, command.boardId));
          if (isLabelNameValid) {
            return Err(new LabelAlreadyExistError());
          } else {
            label.edit({ ...command });
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
            return Ok(new IdResponse(command.id));
          }
        }
      } else {
        return Err(new ArgumentNotProvideException());
      }
    } else {
      return Err(new BoardCannotAccessedError());
    }
  }
}
