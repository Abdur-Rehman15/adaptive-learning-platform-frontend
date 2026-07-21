import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';

const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const ProtectedRoute = () => {
  const { isHydrating } = useAuth();

  if (isHydrating) {
    return null;
  }

  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};