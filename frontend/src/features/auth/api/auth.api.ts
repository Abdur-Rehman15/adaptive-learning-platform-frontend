import { apiFetch } from '@/api/client';
import type { ApiResponse } from '@/types/api.types';
import type { LoginPayload, LoginResponse } from '../types/auth.types';

export const loginRequest = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const res = await apiFetch<ApiResponse<LoginResponse>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
};