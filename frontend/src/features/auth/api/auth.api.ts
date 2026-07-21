import { apiFetch } from '@/api/client';
import type {
  CurrentUserResponse,
  LoginPayload,
  LoginResponse,
} from '../types/auth.types';

export const loginRequest = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const formBody = new URLSearchParams();
  formBody.append('username', payload.username);
  formBody.append('password', payload.password);

  return apiFetch<LoginResponse>('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody,
  });
};

export const getCurrentUserRequest = async (
  token: string
): Promise<CurrentUserResponse> => {
  return apiFetch<CurrentUserResponse>('/users/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};