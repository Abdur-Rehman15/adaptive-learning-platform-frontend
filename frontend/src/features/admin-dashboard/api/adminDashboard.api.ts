import { apiFetch } from '@/api/client';
import type {
  InstructorCourse,
  InstructorDashboardData,
} from '../types/adminDashboard.types';
import {
  normalizeInstructorCourses,
  normalizeInstructorDashboard,
} from '../utils/adminDashboardMappers';

const withAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const fetchInstructorCourses = async (
  token: string
): Promise<InstructorCourse[]> => {
  const response = await apiFetch<unknown>('/courses/me', {
    method: 'GET',
    headers: withAuthHeaders(token),
  });

  return normalizeInstructorCourses(response);
};

export const fetchInstructorDashboard = async (
  token: string,
  courseId: string,
  fallbackCourse?: InstructorCourse
): Promise<InstructorDashboardData> => {
  const headers = withAuthHeaders(token);

  const [dashboardResponse, courseModules] = await Promise.all([
    apiFetch<unknown>(`/courses/${courseId}/instructor-dashboard`, {
      method: 'GET',
      headers,
    }),
    apiFetch<unknown>(`/courses/${courseId}/modules`, {
      method: 'GET',
      headers,
    }).catch(() => []),
  ]);

  return normalizeInstructorDashboard(dashboardResponse, fallbackCourse, courseModules);
};
