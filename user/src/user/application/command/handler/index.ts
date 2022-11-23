import { ConfirmEmailHandler } from './confirm-email.handler';
import { CreateUserHandler } from './create-user.handler';
import { SetAdminRoleHandler } from './set-admin-role.handler';
import { UpdateUserHandler } from './update-user.handler';

export const commandHandler = [
  CreateUserHandler,
  UpdateUserHandler,
  ConfirmEmailHandler,
  SetAdminRoleHandler,
];
