import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  fetchLearnerCourseSummary,
  fetchLearnerEnrollments,
  fetchLearnerScoreTrends,
} from '../api/dashboard.api';
import type {
  LearnerCourseSummary,
  LearnerEnrollment,
  LearnerScoreTrend,
} from '../types/dashboard.types';
import { buildDashboardStats } from '../utils/dashboardMappers';

export const useLearnerDashboard = () => {
  const { token, user } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const enrollmentsQuery = useQuery<LearnerEnrollment[]>({
    queryKey: ['dashboard', 'enrollments', token],
    queryFn: () => fetchLearnerEnrollments(token as string),
    enabled: Boolean(token),
  });

  const enrollments = enrollmentsQuery.data ?? [];

  useEffect(() => {
    if (!enrollments.length) {
      setSelectedCourseId(null);
      return;
    }

    const isStillValid = selectedCourseId
      ? enrollments.some((enrollment) => enrollment.courseId === selectedCourseId)
      : false;

    if (!isStillValid) {
      setSelectedCourseId(enrollments[0].courseId);
    }
  }, [enrollments, selectedCourseId]);

  const selectedEnrollment = useMemo(
    () => enrollments.find((enrollment) => enrollment.courseId === selectedCourseId) ?? null,
    [enrollments, selectedCourseId]
  );

  const summaryQuery = useQuery<LearnerCourseSummary>({
    queryKey: ['dashboard', 'summary', token, selectedCourseId],
    queryFn: () =>
      fetchLearnerCourseSummary(token as string, selectedCourseId as string, selectedEnrollment ?? undefined),
    enabled: Boolean(token && selectedCourseId),
  });

  const scoreTrendsQuery = useQuery<LearnerScoreTrend[]>({
    queryKey: ['dashboard', 'score-trends', token, selectedCourseId],
    queryFn: () => fetchLearnerScoreTrends(token as string, selectedCourseId as string),
    enabled: Boolean(token && selectedCourseId),
  });

  const dashboardStats = useMemo(() => buildDashboardStats(enrollments), [enrollments]);

  return {
    user,
    enrollments,
    selectedCourseId,
    setSelectedCourseId,
    selectedEnrollment,
    dashboardStats,
    summary: summaryQuery.data ?? null,
    scoreTrends: scoreTrendsQuery.data ?? [],
    isLoadingEnrollments: enrollmentsQuery.isLoading,
    isLoadingSummary: summaryQuery.isLoading,
    isLoadingTrends: scoreTrendsQuery.isLoading,
    enrollmentsError: enrollmentsQuery.error,
    summaryError: summaryQuery.error,
    trendsError: scoreTrendsQuery.error,
  };
};