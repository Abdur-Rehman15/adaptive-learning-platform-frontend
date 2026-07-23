import { apiFetch } from '@/api/client';
import type {
  CurrentUserResponse,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  UpdateUserPayload,
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

export const registerRequest = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  return apiFetch<RegisterResponse>('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateUserRequest = async (
  token: string,
  payload: UpdateUserPayload
): Promise<CurrentUserResponse> => {
  return apiFetch<CurrentUserResponse>('/users/me', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
};