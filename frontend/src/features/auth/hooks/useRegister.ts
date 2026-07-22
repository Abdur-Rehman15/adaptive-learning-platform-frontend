import { useMutation } from '@tanstack/react-query';
import { registerRequest } from '../api/auth.api';

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: Parameters<typeof registerRequest>[0]) => {
      return registerRequest(payload);
    },
    onError: (error) => {
      console.error('Registration failed:', error.message);
    },
  });
};
