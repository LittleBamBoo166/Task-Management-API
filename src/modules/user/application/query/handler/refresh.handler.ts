import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RefreshQuery } from '../impl/refresh.query';
import { RefreshResponse } from 'src/modules/user/interface/dto/refresh.response';
import { JwtService } from '@nestjs/jwt';

@QueryHandler(RefreshQuery)
export class RefreshHandler
  implements IQueryHandler<RefreshQuery, RefreshResponse>
{
  constructor(private jwtService: JwtService) {}

  async execute(query: RefreshQuery): Promise<RefreshResponse> {
    const userId = query.userId;
    const payload = { userId };
    const newToken = this.jwtService.sign(payload);
    const response = new RefreshResponse(query.userId, newToken);
    return response;
  }
}
