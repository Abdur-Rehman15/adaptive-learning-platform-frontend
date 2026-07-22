import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import { fetchInstructorCourses } from '@/features/admin-dashboard/api/adminDashboard.api';
import type { CourseResponse } from '@/features/admin-dashboard/api/adminCourse.api';
import {
  fetchModuleQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../api/courseQuestions.api';
import type {
  QuestionCreatePayload,
  QuestionUpdatePayload,
} from '../types/courseQuestions.types';

const courseQuestionKeys = {
  courses: ['course-questions', 'courses'] as const,
  questions: ['course-questions', 'questions'] as const,
  byModule: (moduleId: number) => ['course-questions', 'questions', 'module', moduleId] as const,
};

const toCourseResponse = (course: { id: string; title: string; description: string; created_by?: string }): CourseResponse => ({
  id: Number(course.id),
  title: course.title,
  description: course.description,
  created_by: course.created_by ?? '',
});

export const useQuestionCourses = () => {
  const { token } = useAuth();

  return useQuery<CourseResponse[]>({
    queryKey: courseQuestionKeys.courses,
    queryFn: async () => {
      const courses = await fetchInstructorCourses(token as string);
      return courses.map(toCourseResponse);
    },
    enabled: Boolean(token),
  });
};

export const useModuleQuestions = (moduleId: number | null) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: moduleId ? courseQuestionKeys.byModule(moduleId) : courseQuestionKeys.questions,
    queryFn: () => fetchModuleQuestions(token as string, moduleId as number),
    enabled: Boolean(token && moduleId !== null),
  });
};

export const useCreateQuestion = (moduleId: number) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: QuestionCreatePayload) =>
      createQuestion(token as string, moduleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseQuestionKeys.byModule(moduleId) });
    },
  });
};

export const useUpdateQuestion = (moduleId: number) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      payload,
    }: {
      questionId: number;
      payload: QuestionUpdatePayload;
    }) => updateQuestion(token as string, questionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseQuestionKeys.byModule(moduleId) });
    },
  });
};

export const useDeleteQuestion = (moduleId: number) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: number) =>
      deleteQuestion(token as string, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseQuestionKeys.byModule(moduleId) });
    },
  });
};