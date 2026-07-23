export interface LearnerEnrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  status: string;
  progressPercent: number;
}

export interface LearnerCourseSummary {
  courseId: string;
  courseTitle: string;
  progressPercent: number;
  averageScore: number;
  weakestTopics: string[];
}

export interface LearnerScoreTrend {
  label: string;
  score: number;
}

export interface LearnerDashboardStats {
  enrolledCourses: number;
  activeCourses: number;
  completedCourses: number;
  averageProgress: number;
}
