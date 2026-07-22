export interface InstructorCourse {
  id: string;
  title: string;
  description: string;
  learnerCount: number;
  completionRate: number;
  averageScore: number;
}

export interface InstructorDashboardSummary {
  courseId: string;
  courseTitle: string;
  totalLearners: number;
  activeLearners: number;
  completedLearners: number;
  averageProgress: number;
  averageScore: number;
  completionRate: number;
  certificatesIssued: number;
}

export interface InstructorModuleMetric {
  id: string;
  title: string;
  learners: number;
  completionRate: number;
  averageScore: number;
}

export interface InstructorLearnerMetric {
  id: string;
  name: string;
  progressPercent: number;
  score: number;
  status: string;
}

export interface InstructorDashboardData {
  summary: InstructorDashboardSummary;
  modules: InstructorModuleMetric[];
  topLearners: InstructorLearnerMetric[];
  recentActivity: string[];
}

export interface InstructorDashboardStats {
  coursesManaged: number;
  totalLearners: number;
  activeLearners: number;
  completedLearners: number;
  averageScore: number;
}
