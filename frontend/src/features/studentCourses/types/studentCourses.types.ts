import type { CourseResponse } from '@/features/admin-dashboard/api/adminCourse.api';

export interface StudentCourse extends CourseResponse {
  isEnrolled: boolean;
  enrollmentStatus?: string;
  progressPercent?: number;
}
