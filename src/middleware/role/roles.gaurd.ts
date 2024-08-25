import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from 'src/modules/role/services/role.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
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
    const decodedToken = this.jwtService.decode(token);
    if (!decodedToken || !decodedToken.exp) {
      throw new UnauthorizedException('Unauthorized: Invalid token');
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      throw new UnauthorizedException('Unauthorized: Token expired');
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
