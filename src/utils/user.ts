import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const PayloadUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.user) {
      return request.user;
    }
    return {
      userId: 0,
      name: 'system',
      username: 'system',
      email: '100@qq.com',
    };
  },
);
