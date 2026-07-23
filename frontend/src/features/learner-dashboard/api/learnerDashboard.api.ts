import { apiFetch } from '@/api/client';
import type {
  LearnerCourseSummary,
  LearnerEnrollment,
  LearnerScoreTrend,
} from '../types/learnerDashboard.types';
import {
  normalizeCourseSummary,
  normalizeEnrollments,
  normalizeScoreTrends,
} from '../utils/learnerDashboardMappers';

const withAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const fetchLearnerEnrollments = async (
  token: string
): Promise<LearnerEnrollment[]> => {
  const response = await apiFetch<unknown>('/enrollments/me', {
    method: 'GET',
    headers: withAuthHeaders(token),
  });

  return normalizeEnrollments(response);
};

export const fetchLearnerCourseSummary = async (
  token: string,
  courseId: string,
  fallbackCourse?: LearnerEnrollment
): Promise<LearnerCourseSummary> => {
  const response = await apiFetch<unknown>(`/courses/${courseId}/learner-summary`, {
    method: 'GET',
    headers: withAuthHeaders(token),
  });

  return normalizeCourseSummary(response, fallbackCourse);
};

export const fetchLearnerScoreTrends = async (
  token: string,
  courseId: string
): Promise<LearnerScoreTrend[]> => {
  const response = await apiFetch<unknown>(`/courses/${courseId}/score-trends`, {
    method: 'GET',
    headers: withAuthHeaders(token),
  });

  return normalizeScoreTrends(response);
};
