import { apiFetch } from '@/api/client';
import type { CourseResponse, ModuleResponse } from '@/features/admin-dashboard/api/adminCourse.api';

const withAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const fetchStudentCourses = async (token: string): Promise<CourseResponse[]> => {
  return apiFetch<CourseResponse[]>('/courses', {
    method: 'GET',
    headers: withAuthHeaders(token),
  });
};

export const enrollInCourse = async (token: string, courseId: number): Promise<void> => {
  await apiFetch<void>(`/enroll/${courseId}`, {
    method: 'POST',
    headers: withAuthHeaders(token),
    body: JSON.stringify({}),
  });
};

export const fetchCourseModules = async (
  token: string,
  courseId: number
): Promise<ModuleResponse[]> => {
  return apiFetch<ModuleResponse[]>(`/courses/${courseId}/modules`, {
    method: 'GET',
    headers: withAuthHeaders(token),
  });
};
