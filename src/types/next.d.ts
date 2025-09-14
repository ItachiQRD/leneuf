import { NextApiRequest } from 'next';

declare module 'next' {
  interface NextApiRequest {
    user?: {
      userId: string;
      email: string;
      isAdmin: boolean;
    };
  }
}
