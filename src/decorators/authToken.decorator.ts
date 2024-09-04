import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authToken = request.headers['authorization'];
    if (authToken && authToken.split(' ')[0].toLowerCase() === 'bearer') {
      return authToken.split(' ')[1];
    }
    return null;
  },
);
