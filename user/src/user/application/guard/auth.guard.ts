import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';

export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    Logger.log('Authenticating ....');
    const req = context.switchToHttp().getRequest();
    try {
      const accessToken = req.cookies?.Authentication;
      // console.log(accessToken);
      const res = await this.authClient
        .send({ role: 'auth', cmd: 'check' }, { jwt: accessToken })
        .pipe(timeout(5000))
        .toPromise();
      req.user = {
        id: res.id,
        name: res.username,
        email: res.email,
        isComfirmed: res.isComfirmed,
        role: res.role,
      };
      // console.log(req.user);
      return res;
    } catch (error) {
      return false;
    }
  }
}
