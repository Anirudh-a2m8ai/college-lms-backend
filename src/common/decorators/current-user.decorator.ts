import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type User = {
  id: string;
  email: string;
  role: string;
};

export const CurrentUser = createParamDecorator(
  (field: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;
    return field ? user?.[field] : user;
  },
);