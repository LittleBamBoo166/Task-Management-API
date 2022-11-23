import { GetTaskByListIdHandler } from './get-tasks-by-list-id.handler';
import { GetTaskByIdHandler } from './get-task-by-id.handler';
import { GetHistoryHandler } from './get-history.handler';

export const queryHandler = [
  GetTaskByIdHandler,
  GetTaskByListIdHandler,
  GetHistoryHandler,
];
