import { apiFetch } from '@/api/client';
import type {
  Question,
  QuestionCreatePayload,
  QuestionUpdatePayload,
} from '../types/courseQuestions.types';

const withAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const fetchModuleQuestions = async (
  token: string,
  moduleId: number
): Promise<Question[]> => {
  return apiFetch<Question[]>(`/modules/${moduleId}/questions`, {
    method: 'GET',
    headers: withAuthHeaders(token),
  });
};

export const createQuestion = async (
  token: string,
  moduleId: number,
  payload: QuestionCreatePayload
): Promise<Question> => {
  return apiFetch<Question>(`/modules/${moduleId}/questions`, {
    method: 'POST',
    headers: withAuthHeaders(token),
    body: JSON.stringify(payload),
  });
};

export const updateQuestion = async (
  token: string,
  questionId: number,
  payload: QuestionUpdatePayload
): Promise<Question> => {
  return apiFetch<Question>(`/questions/${questionId}`, {
    method: 'PATCH',
    headers: withAuthHeaders(token),
    body: JSON.stringify(payload),
  });
};

export const deleteQuestion = async (
  token: string,
  questionId: number
): Promise<void> => {
  await apiFetch<null>(`/questions/${questionId}`, {
    method: 'DELETE',
    headers: withAuthHeaders(token),
  });
};