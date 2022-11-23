import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MemberRepositoryPort } from '../../domain/database/member.repository.port';
import { UserCreatedBoardEvent } from '../../domain/event/user-created-board.event';
import { MemberFactory } from '../../domain/member.factory';
import { InjectionToken } from '../injection.token';

@EventsHandler(UserCreatedBoardEvent)
export class AddMemberWhenBoardIsCreatedHandler
  implements IEventHandler<UserCreatedBoardEvent>
{
  constructor(
    @Inject(InjectionToken.MEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepositoryPort,
    private readonly memberFactory: MemberFactory,
  ) {}

  async handle(event: UserCreatedBoardEvent) {
    const member = this.memberFactory.create(event.userId);
    await this.memberRepository.save(member, event.id);
  }
}
