import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard } from '../guards';

export const META_ROLES = 'roles';

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata(META_ROLES, roles),
    UseGuards(AuthGuard, RolesGuard),
  );
}
