import { Request } from 'express';
import { User } from 'src/user/infrastructure/entity/user.orm-entity';

export interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;
