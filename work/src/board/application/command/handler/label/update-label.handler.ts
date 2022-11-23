import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { ArgumentNotProvideException } from 'src/libs/argument-not-provide.exception';
import { Checking } from 'src/libs/checking';
import { BoardRepositoryPort } from 'src/board/domain/database/board.repository.port';
import { LabelRepositoryPort } from 'src/board/domain/database/label.repository.port';
import { BoardCannotAccessedError } from 'src/board/domain/error/board.error';
import {
  LabelAlreadyExistError,
  LabelNotFoundError,
} from 'src/board/domain/error/label.error';
import { InjectionToken } from '../../../injection.token';
import { UpdateLabelCommand } from '../../impl/label/update-label.command';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

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
    private readonly historyService: HistoryService,
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
      command.requesterId,
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
          let isLabelNameValid: boolean;
          if (Checking.isEmpty(command.name)) {
            isLabelNameValid = true;
          } else {
            isLabelNameValid = !(await this.labelRepository.exists(
              command.name,
              command.boardId,
            ));
          }
          if (isLabelNameValid) {
            if (command.name) {
              const historyObject: CreateHistoryObject = {
                userId: command.requesterId,
                boardId: command.boardId,
                action: 'UPDATE',
                message: 'updated the label name',
                changedContent: {
                  id: command.id,
                  old: label.getProperties().name,
                  new: command.name,
                },
              };
              const historyEntity = this.historyService.create(historyObject);
              await this.historyService.save(historyEntity);
            }
            label.edit({ ...command });
            await this.labelRepository.save(label, command.boardId);
            return Ok(new IdResponse(command.id));
          } else {
            return Err(new LabelAlreadyExistError());
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
