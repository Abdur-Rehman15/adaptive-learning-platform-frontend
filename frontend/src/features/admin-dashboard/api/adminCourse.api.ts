import { apiFetch } from '@/api/client';

const withAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export interface CourseCreatePayload {
  title: string;
  description: string;
}

export interface CourseResponse {
  id: number;
  title: string;
  description: string;
  created_by: string;
}

export interface ModuleCreatePayload {
  title: string;
  order: number;
  content_url: string;
}

export interface ModuleResponse {
  id: number;
  course_id: number;
  title: string;
  order: number;
  content_url: string;
}

export const createCourse = async (
  token: string,
  payload: CourseCreatePayload
): Promise<CourseResponse> => {
  return apiFetch<CourseResponse>('/courses', {
    method: 'POST',
    headers: withAuthHeaders(token),
    body: JSON.stringify(payload),
  });
};

export const createModule = async (
  token: string,
  courseId: number,
  payload: ModuleCreatePayload
): Promise<ModuleResponse> => {
  return apiFetch<ModuleResponse>(`/courses/${courseId}/modules`, {
    method: 'POST',
    headers: withAuthHeaders(token),
    body: JSON.stringify(payload),
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
