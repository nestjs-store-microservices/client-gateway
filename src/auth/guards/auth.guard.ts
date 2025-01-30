import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Request } from 'express';

import { firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from 'src/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const { user, token: tokenJwt } = await firstValueFrom(
        this.client.send('auth.verify.token', token),
      );

      if (!user.isActive) {
        throw new RpcException({
          status: HttpStatus.UNAUTHORIZED,
          message: 'User is not active',
        });
      }

      request['user'] = user;
      request['token'] = tokenJwt;
    } catch (err) {
      if (err instanceof RpcException) {
        throw err;
      }

      throw new UnauthorizedException(err);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
