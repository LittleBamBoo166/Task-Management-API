import { DeleteTasksWhenBoardDeletedHandler } from './delete-tasks-when-board-deleted.handler';
import { DeleteTasksWhenListDeletedHandler } from './delete-tasks-when-list-deleted.handler';

export const eventHandler = [
  DeleteTasksWhenBoardDeletedHandler,
  DeleteTasksWhenListDeletedHandler,
];
