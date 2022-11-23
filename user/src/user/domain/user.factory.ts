import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import {
  UserEssentialProperties,
  UserModel,
  UserOptionalProperties,
} from './model/user.model';
import { v4 as uuidv4 } from 'uuid';

export class UserFactory {
  constructor(
    @Inject(EventPublisher) private readonly eventPublisher: EventPublisher,
  ) {}

  create(name: string, email: string): UserModel {
    return this.eventPublisher.mergeObjectContext(
      new UserModel({
        id: uuidv4(),
        name: name,
        email: email.toLowerCase(),
        role: 'user',
      }),
    );
  }

  reconstitute(
    properties: UserEssentialProperties & UserOptionalProperties,
  ): UserModel {
    return this.eventPublisher.mergeObjectContext(new UserModel(properties));
  }
}
