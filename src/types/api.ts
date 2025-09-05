// src/types/api.ts
import { NextApiRequest, NextApiResponse } from 'next';

export type ApiHandler<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>
) => Promise<void>;

export type ApiResponse<T = any> = NextApiResponse<T>;
export type ApiRequest = NextApiRequest;