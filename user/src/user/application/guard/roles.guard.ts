import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import RequestWithUser from 'src/libs/request-with-user';
import { Role } from '../roles.enum';

// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     Logger.log('Checking role .........');
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (!requiredRoles) return true;
//     const req = context.switchToHttp().getRequest();
//     try {
//       console.log(req.user);
//       return requiredRoles.some((role) => req.user.role?.include(role));
//     } catch (error) {
//       return false;
//     }
//   }
// }
const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
      console.log(user);
      return user?.role.includes(role);
    }
  }
  return mixin(RoleGuardMixin);
};

export default RoleGuard;
