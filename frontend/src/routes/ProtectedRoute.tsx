import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};