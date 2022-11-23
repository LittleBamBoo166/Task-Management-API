import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

export default RequestWithUser;
