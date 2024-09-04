import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { IAuthService } from 'src/modules/auth/services/auth-service.interface';
import { IRoleService } from 'src/modules/role/services/role-service.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject('IRoleService') private readonly roleService: IRoleService,
    @Inject('IAuthService') private readonly authService: IAuthService,
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const roles =
      this.reflector.get<string[]>('roles', context.getHandler()) ||
      this.reflector.get<string[]>('roles', context.getClass());

    const request = context.switchToHttp().getRequest();
    const authToken = request.headers['authorization'];

    if (!authToken) {
      throw new ForbiddenException('Forbidden: Missing authorization token');
    }

    const tokenParts = authToken.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
      throw new ForbiddenException(
        'Forbidden: Invalid authorization token format',
      );
    }

    const token = tokenParts[1];
    const decodedToken = this.jwtService.decode(token) as any;

    if (!decodedToken || !decodedToken.exp) {
      throw new UnauthorizedException('Unauthorized: Invalid token');
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      throw new UnauthorizedException('Unauthorized: Token expired');
    }

    // Here you should check if the token is still valid and not logged out
    const isTokenValid = await this.authService.isTokenValid(token); // Implement this method
    if (!isTokenValid) {
      throw new UnauthorizedException(
        'Unauthorized: Token has been invalidated',
      );
    }

    // If no roles are specified, allow any authenticated user
    if (!roles || roles.length === 0) {
      return true;
    }

    const roleInfo = await this.roleService.findById(decodedToken.roleId);

    if (!roleInfo || !roleInfo.strRoleName) {
      throw new UnauthorizedException('Unauthorized: Invalid role');
    }

    const isRoleAllowed = roles.some((role) =>
      roleInfo.strRoleName.includes(role),
    );

    if (isRoleAllowed) {
      return true;
    } else {
      throw new UnauthorizedException(
        `Unauthorized: ${roleInfo.strRoleName} does not have permission to access this resource`,
      );
    }
  }
}
