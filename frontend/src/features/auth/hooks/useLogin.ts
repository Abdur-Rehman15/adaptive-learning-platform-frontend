import { useMutation } from '@tanstack/react-query';
import { loginRequest } from '../api/auth.api';

export const useLogin = () => {
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token);
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    },
  });
};