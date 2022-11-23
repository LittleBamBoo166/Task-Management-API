import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    console.log(req.user);
    if (req.user?.isComfirmed) {
      return true;
    } else {
      throw new UnauthorizedException('Confirm your email first');
    }
  }
}
