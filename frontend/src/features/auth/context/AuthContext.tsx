import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getCurrentUserRequest } from '../api/auth.api';
import type { CurrentUserResponse } from '../types/auth.types';

interface AuthContextValue {
  token: string | null;
  user: CurrentUserResponse | null;
  role: 'user' | 'admin' | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  setSession: (token: string, user: CurrentUserResponse) => void;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token')
  );
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [isHydrating, setIsHydrating] = useState(() => !!localStorage.getItem('token'));

  const role = useMemo<'user' | 'admin' | null>(() => user?.role ?? null, [user]);
  const isAuthenticated = useMemo<boolean>(() => !!user && !!token, [user, token]);

  useEffect(() => {
    let isActive = true;

    const hydrateUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        if (isActive) {
          setIsHydrating(false);
        }
        return;
      }

      try {
        const currentUser = await getCurrentUserRequest(storedToken);

        if (isActive) {
          setUser(currentUser);
        }
      } catch {
        if (isActive) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isActive) {
          setIsHydrating(false);
        }
      }
    };

    void hydrateUser();

    return () => {
      isActive = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      role,
      isAuthenticated,
      isHydrating,
      setSession: (nextToken, nextUser) => {
        localStorage.setItem('token', nextToken);
        setToken(nextToken);
        setUser(nextUser);
      },
      clearSession: () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      },
    }),
    [isHydrating, token, user, role, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};