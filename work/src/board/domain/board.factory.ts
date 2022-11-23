import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { BoardModel, BoardProperties } from './model/board.model';
import { v4 as uuidv4 } from 'uuid';

export class BoardFactory {
  constructor(
    @Inject(EventPublisher) private readonly eventPublisher: EventPublisher,
  ) {}

  create(name: string, ownerId: string, description?: string): BoardModel {
    return this.eventPublisher.mergeObjectContext(
      new BoardModel({
        id: uuidv4(),
        name: name,
        ownerId: ownerId,
        description: description,
      }),
    );
  }

  reconstitute(properties: BoardProperties): BoardModel {
    return this.eventPublisher.mergeObjectContext(new BoardModel(properties));
  }
}
