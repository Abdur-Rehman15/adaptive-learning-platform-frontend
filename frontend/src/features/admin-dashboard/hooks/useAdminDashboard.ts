import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  fetchInstructorCourses,
  fetchInstructorDashboard,
} from '../api/adminDashboard.api';
import type {
  InstructorCourse,
  InstructorDashboardData,
} from '../types/adminDashboard.types';
import { buildInstructorDashboardStats } from '../utils/adminDashboardMappers';

export const useAdminDashboard = () => {
  const { token, user } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const coursesQuery = useQuery<InstructorCourse[]>({
    queryKey: ['admin-dashboard', 'courses', token],
    queryFn: () => fetchInstructorCourses(token as string),
    enabled: Boolean(token),
  });

  const courses = coursesQuery.data ?? [];

  useEffect(() => {
    if (!courses.length) {
      setSelectedCourseId(null);
      return;
    }

    const isStillValid = selectedCourseId
      ? courses.some((course) => course.id === selectedCourseId)
      : false;

    if (!isStillValid) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) ?? null,
    [courses, selectedCourseId]
  );

  const dashboardQuery = useQuery<InstructorDashboardData>({
    queryKey: ['admin-dashboard', 'data', token, selectedCourseId],
    queryFn: () =>
      fetchInstructorDashboard(token as string, selectedCourseId as string, selectedCourse ?? undefined),
    enabled: Boolean(token && selectedCourseId),
  });

  const dashboardData = dashboardQuery.data ?? null;

  const dashboardStats = useMemo(
    () => buildInstructorDashboardStats(courses, dashboardData?.summary),
    [courses, dashboardData]
  );

  return {
    user,
    courses,
    selectedCourseId,
    setSelectedCourseId,
    selectedCourse,
    dashboardStats,
    dashboardData,
    isLoadingCourses: coursesQuery.isLoading,
    isLoadingDashboard: dashboardQuery.isLoading,
    coursesError: coursesQuery.error,
    dashboardError: dashboardQuery.error,
  };
};
