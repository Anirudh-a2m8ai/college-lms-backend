import { Socket } from 'socket.io';

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
  tenantId: string;
  permissions: string[];
}

export interface AuthenticatedSocket extends Socket {
  data: {
    user: AuthUser;
    classId: string;
  };
}
