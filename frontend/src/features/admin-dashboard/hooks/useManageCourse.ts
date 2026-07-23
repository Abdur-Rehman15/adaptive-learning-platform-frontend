import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  deleteCourse,
  deleteModule,
  reorderModules,
  updateCourse,
  updateModule,
  type CourseUpdatePayload,
  type ModuleReorderPayload,
  type ModuleUpdatePayload,
} from '../api/adminCourse.api';

const invalidateCourseQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  courseId: number
) => {
  void queryClient.invalidateQueries({ queryKey: ['admin-dashboard', 'courses'] });
  void queryClient.invalidateQueries({
    queryKey: ['admin-dashboard', 'data'],
  });
  void queryClient.invalidateQueries({ queryKey: ['course-modules', courseId] });
};

export const useUpdateCourse = (courseId: number | null) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CourseUpdatePayload) =>
      updateCourse(token as string, courseId as number, payload),
    onSuccess: () => {
      if (courseId != null) {
        invalidateCourseQueries(queryClient, courseId);
      }
    },
  });
};

export const useUpdateModule = (courseId: number | null) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      moduleId,
      payload,
    }: {
      moduleId: number;
      payload: ModuleUpdatePayload;
    }) => updateModule(token as string, courseId as number, moduleId, payload),
    onSuccess: () => {
      if (courseId != null) {
        invalidateCourseQueries(queryClient, courseId);
      }
    },
  });
};

export const useReorderModules = (courseId: number | null) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (modules: ModuleReorderPayload) =>
      reorderModules(token as string, courseId as number, modules),
    onSuccess: () => {
      if (courseId != null) {
        invalidateCourseQueries(queryClient, courseId);
      }
    },
  });
};

export const useDeleteCourse = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => deleteCourse(token as string, courseId),
    onSuccess: (_data, courseId) => {
      void queryClient.invalidateQueries({ queryKey: ['admin-dashboard', 'courses'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-dashboard', 'data'] });
      void queryClient.invalidateQueries({ queryKey: ['course-modules', courseId] });
    },
  });
};

export const useDeleteModule = (courseId: number | null) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moduleId: number) =>
      deleteModule(token as string, courseId as number, moduleId),
    onSuccess: () => {
      if (courseId != null) {
        invalidateCourseQueries(queryClient, courseId);
      }
    },
  });
};
