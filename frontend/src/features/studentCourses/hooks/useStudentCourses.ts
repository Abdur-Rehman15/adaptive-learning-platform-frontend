import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import { fetchStudentCourses, enrollInCourse } from '../api/studentCourses.api';
import { fetchLearnerEnrollments } from '@/features/learner-dashboard/api/learnerDashboard.api';
import type { StudentCourse } from '../types/studentCourses.types';

export const useStudentCourses = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const coursesQuery = useQuery({
    queryKey: ['student-courses', 'all-courses', token],
    queryFn: () => fetchStudentCourses(token as string),
    enabled: Boolean(token),
  });

  const enrollmentsQuery = useQuery({
    queryKey: ['learner-dashboard', 'enrollments', token],
    queryFn: () => fetchLearnerEnrollments(token as string),
    enabled: Boolean(token),
  });

  const allCourses = coursesQuery.data ?? [];
  const enrollments = enrollmentsQuery.data ?? [];

  const studentCourses: StudentCourse[] = allCourses.map((course) => {
    const enrollment = enrollments.find(
      (e) => String(e.courseId) === String(course.id)
    );

    return {
      ...course,
      isEnrolled: !!enrollment,
      enrollmentStatus: enrollment?.status,
      progressPercent: enrollment?.progressPercent ?? 0,
    };
  });

  const enrollMutation = useMutation({
    mutationFn: (courseId: number) => enrollInCourse(token as string, courseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['student-courses'] });
      void queryClient.invalidateQueries({ queryKey: ['learner-dashboard'] });
    },
    onError: () => {
      // Still invalidate in case enrollment committed before the server error
      void queryClient.invalidateQueries({ queryKey: ['student-courses'] });
      void queryClient.invalidateQueries({ queryKey: ['learner-dashboard'] });
    },
  });

  return {
    courses: studentCourses,
    isLoading: coursesQuery.isLoading || enrollmentsQuery.isLoading,
    error: coursesQuery.error || enrollmentsQuery.error,
    enroll: enrollMutation.mutate,
    isEnrolling: enrollMutation.isPending,
    enrollingCourseId: enrollMutation.isPending ? enrollMutation.variables : null,
    enrollError: enrollMutation.error,
  };
};
