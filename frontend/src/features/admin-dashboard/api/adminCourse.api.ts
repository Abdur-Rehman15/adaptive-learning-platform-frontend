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

export interface CourseUpdatePayload {
  title?: string;
  description?: string;
}

export interface ModuleCreatePayload {
  title: string;
  order: number;
  content_url: string;
}

export interface ModuleUpdatePayload {
  title?: string;
  order?: number;
  content_url?: string;
}

/** Ordered module entries for PATCH /courses/{courseId}/modules */
export interface ModuleOrderItem {
  module_id: number;
  order: number;
}

export type ModuleReorderPayload = ModuleOrderItem[];

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

export const updateCourse = async (
  token: string,
  courseId: number,
  payload: CourseUpdatePayload
): Promise<CourseResponse> => {
  return apiFetch<CourseResponse>(`/courses/${courseId}`, {
    method: 'PATCH',
    headers: withAuthHeaders(token),
    body: JSON.stringify(payload),
  });
};

export const updateModule = async (
  token: string,
  courseId: number,
  moduleId: number,
  payload: ModuleUpdatePayload
): Promise<ModuleResponse> => {
  return apiFetch<ModuleResponse>(`/courses/${courseId}/modules/${moduleId}`, {
    method: 'PATCH',
    headers: withAuthHeaders(token),
    body: JSON.stringify(payload),
  });
};

export const reorderModules = async (
  token: string,
  courseId: number,
  modules: ModuleReorderPayload
): Promise<ModuleResponse[]> => {
  return apiFetch<ModuleResponse[]>(`/courses/${courseId}/modules`, {
    method: 'PATCH',
    headers: withAuthHeaders(token),
    body: JSON.stringify(modules),
  });
};

export const deleteCourse = async (token: string, courseId: number): Promise<void> => {
  await apiFetch<null>(`/courses/${courseId}`, {
    method: 'DELETE',
    headers: withAuthHeaders(token),
  });
};

export const deleteModule = async (
  token: string,
  courseId: number,
  moduleId: number
): Promise<void> => {
  await apiFetch<null>(`/courses/${courseId}/modules/${moduleId}`, {
    method: 'DELETE',
    headers: withAuthHeaders(token),
  });
};
