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
  const response = await apiFetch<unknown>(`/courses/${courseId}/instructor-dashboard`, {
    method: 'GET',
    headers: withAuthHeaders(token),
  });

  return normalizeInstructorDashboard(response, fallbackCourse);
};
