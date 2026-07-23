import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  createCourse,
  createModule,
  fetchCourseModules,
  type CourseCreatePayload,
  type ModuleCreatePayload,
} from '../api/adminCourse.api';

export const useCreateCourse = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CourseCreatePayload) =>
      createCourse(token as string, payload),
    onSuccess: () => {
      // Invalidate instructor courses so dashboard refreshes
      void queryClient.invalidateQueries({ queryKey: ['admin-dashboard', 'courses'] });
    },
  });
};

export const useCreateModule = (courseId: number | null) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ModuleCreatePayload) =>
      createModule(token as string, courseId as number, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-dashboard', 'courses'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-dashboard', 'data'] });
      void queryClient.invalidateQueries({ queryKey: ['course-modules', courseId] });
    },
  });
};

export const useCourseModules = (courseId: number | null) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['course-modules', courseId, token],
    queryFn: () => fetchCourseModules(token as string, courseId as number),
    enabled: Boolean(token && courseId),
  });
};
