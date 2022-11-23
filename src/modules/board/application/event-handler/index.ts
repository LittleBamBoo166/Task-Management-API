import { AddMemberWhenBoardIsCreatedHandler } from './add-member-when-board-is-created.handler';
import { CreateListsWhenBoardIsCreatedHandler } from './create-lists-when-board-is-created.handler';

export const eventHandlers = [
  CreateListsWhenBoardIsCreatedHandler,
  AddMemberWhenBoardIsCreatedHandler,
];
