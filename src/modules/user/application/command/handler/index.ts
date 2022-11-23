import { CreateUserHandler } from './create-user.handler';
import { LoginHandler } from './login.handler';
import { UpdateUserHandler } from './update-user.handler';

export const commandHandlers = [
  CreateUserHandler,
  LoginHandler,
  UpdateUserHandler,
];
