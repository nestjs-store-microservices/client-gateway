import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const validRoles: string[] = this.reflector.get(
      'roles',
      context.getHandler(),
    );

    console.log(validRoles);

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    if (!user) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'User not found',
      });
    }

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }

    throw new RpcException({
      status: HttpStatus.FORBIDDEN,
      message: `User: ${user.fullName}, need a valid role`,
    });
  }
}
