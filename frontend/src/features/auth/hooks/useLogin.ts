import { useMutation } from '@tanstack/react-query';
import { getCurrentUserRequest, loginRequest } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';

export const useLogin = () => {
  const { setSession } = useAuth();

  return useMutation({
    mutationFn: async (payload: Parameters<typeof loginRequest>[0]) => {
      const auth = await loginRequest(payload);

      const currentUser = await getCurrentUserRequest(auth.access_token);
      setSession(auth.access_token, currentUser);
      return { auth, currentUser };
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    },
  });
};