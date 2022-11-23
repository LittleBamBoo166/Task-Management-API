import { GetAllUsersHandler } from './get-all-users.handler';
import { GetUserHandler } from './get-user.handler';
import { RefreshHandler } from './refresh.handler';

export const queryHandlers = [
  GetAllUsersHandler,
  RefreshHandler,
  GetUserHandler,
];
