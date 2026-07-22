import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { LoginPage } from '@/pages/Login';
import { RegisterPage } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { CreateCoursePage } from '@/pages/CreateCourse';
import { CoursesPage } from '@/pages/Courses';
import { ProtectedRoute } from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/courses',
        element: <CoursesPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        path: '/courses/create',
        element: <CreateCoursePage />,
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;