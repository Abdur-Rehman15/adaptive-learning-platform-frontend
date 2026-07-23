export interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface CurrentUserResponse {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface RegisterPayload {
  username: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
}

export type RegisterResponse = CurrentUserResponse;

export interface UpdateUserPayload {
  username?: string;
  email?: string;
}