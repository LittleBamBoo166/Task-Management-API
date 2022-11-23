import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ListRepositoryPort } from '../../domain/database/list.repository.port';
import { UserCreatedBoardEvent } from '../../domain/event/user-created-board.event';
import { ListFactory } from '../../domain/list.factory';
import { ListModel } from '../../domain/model/list.model';
import { InjectionToken } from '../injection.token';

@EventsHandler(UserCreatedBoardEvent)
export class CreateListsWhenBoardIsCreatedHandler
  implements IEventHandler<UserCreatedBoardEvent>
{
  constructor(
    @Inject(InjectionToken.LIST_REPOSITORY)
    private listRepository: ListRepositoryPort,
    private readonly listFactory: ListFactory,
  ) {}

  async handle(event: UserCreatedBoardEvent) {
    const listDemo1 = this.listFactory.create('Not pending', '#ffc300', 1);
    const listDemo2 = this.listFactory.create('Doing', '#ffc300', 2);
    const listDemo3 = this.listFactory.create('Complete', '#ffc300', 3);
    const lists: ListModel[] = [listDemo1, listDemo2, listDemo3];
    await this.listRepository.save(lists, event.id);
  }
}
