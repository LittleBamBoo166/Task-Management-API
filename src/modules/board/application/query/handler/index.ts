import { GetBoardByIdHandler } from './get-board-by-id.handler';
import { GetBoardsHandler } from './get-boards.handler';
import { GetHistoryHandler } from './get-history.handler';

export const queryHandler = [
  GetBoardsHandler,
  GetBoardByIdHandler,
  GetHistoryHandler,
];
