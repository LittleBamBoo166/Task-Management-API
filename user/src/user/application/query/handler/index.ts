import { GetAllUsersHandler } from './get-all-users.handler';
import { GetUserHandler } from './get-user-by-id.handler';

export const queryHandler = [GetAllUsersHandler, GetUserHandler];
