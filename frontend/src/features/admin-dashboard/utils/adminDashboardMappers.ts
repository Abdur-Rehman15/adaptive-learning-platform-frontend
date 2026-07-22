import type {
  InstructorCourse,
  InstructorDashboardData,
  InstructorDashboardStats,
  InstructorLearnerMetric,
  InstructorModuleMetric,
} from '../types/adminDashboard.types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toText = (value: unknown, fallback: string) => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
};

const toNumber = (value: unknown, fallback: number) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : fallback;
  }

  return fallback;
};

const clampPercentage = (value: number) => Math.max(0, Math.min(100, value));

const normalizeList = (rawValue: unknown) => {
  if (Array.isArray(rawValue)) {
    return rawValue;
  }

  if (isRecord(rawValue) && Array.isArray(rawValue.data)) {
    return rawValue.data;
  }

  return [];
};

const normalizeMaybeRecord = (rawValue: unknown) => {
  if (isRecord(rawValue) && isRecord(rawValue.data)) {
    return rawValue.data;
  }

  return isRecord(rawValue) ? rawValue : {};
};

export const normalizeInstructorCourses = (
  rawValue: unknown
): InstructorCourse[] => {
  return normalizeList(rawValue).map((item, index) => {
    const entry = isRecord(item) ? item : {};

    return {
      id: toText(
        entry.id ?? entry.course_id ?? entry.courseId ?? index + 1,
        `course-${index + 1}`
      ),
      title: toText(
        entry.title ?? entry.course_title ?? entry.courseTitle ?? entry.name,
        `Course ${index + 1}`
      ),
      description: toText(entry.description ?? entry.summary ?? entry.course_description ?? '', ''),
      learnerCount: Math.max(
        0,
        Math.round(
          toNumber(entry.learner_count ?? entry.learners_count ?? entry.learnerCount, 0)
        )
      ),
      completionRate: clampPercentage(
        toNumber(entry.completion_rate ?? entry.completionRate ?? entry.progress_percent, 0)
      ),
      averageScore: clampPercentage(toNumber(entry.average_score ?? entry.averageScore ?? entry.score, 0)),
    };
  });
};

const normalizeInstructorModules = (rawValue: unknown): InstructorModuleMetric[] => {
  return normalizeList(rawValue).map((item, index) => {
    const entry = isRecord(item) ? item : {};

    return {
      id: toText(
        entry.id ?? entry.module_id ?? entry.moduleId ?? index + 1,
        `module-${index + 1}`
      ),
      title: toText(
        entry.title ?? entry.module_title ?? entry.moduleTitle ?? entry.name,
        `Module ${index + 1}`
      ),
      learners: Math.max(0, Math.round(toNumber(entry.learners ?? entry.learner_count ?? 0, 0))),
      completionRate: clampPercentage(
        toNumber(entry.completion_rate ?? entry.completionRate ?? entry.progress_percent, 0)
      ),
      averageScore: clampPercentage(toNumber(entry.average_score ?? entry.averageScore ?? entry.score, 0)),
    };
  });
};

const normalizeInstructorTopLearners = (rawValue: unknown): InstructorLearnerMetric[] => {
  return normalizeList(rawValue).map((item, index) => {
    const entry = isRecord(item) ? item : {};

    return {
      id: toText(entry.id ?? entry.user_id ?? entry.userId ?? index + 1, `learner-${index + 1}`),
      name: toText(
        entry.username ?? entry.name ?? entry.full_name ?? entry.fullName,
        `Learner ${index + 1}`
      ),
      progressPercent: clampPercentage(
        toNumber(entry.progress_percent ?? entry.progressPercent ?? entry.progress, 0)
      ),
      score: clampPercentage(toNumber(entry.score ?? entry.average_score ?? entry.averageScore, 0)),
      status: toText(entry.status ?? entry.state, 'In progress'),
    };
  });
};

const normalizeRecentActivity = (rawValue: unknown): string[] => {
  return normalizeList(rawValue)
    .map((item, index) => {
      const entry = isRecord(item) ? item : {};

      return toText(
        entry.message ?? entry.title ?? entry.description ?? entry.activity ?? entry.name,
        `Activity ${index + 1}`
      );
    })
    .filter((item) => item.length > 0);
};

export const normalizeInstructorDashboard = (
  rawValue: unknown,
  fallbackCourse?: InstructorCourse
): InstructorDashboardData => {
  const root = normalizeMaybeRecord(rawValue);
  const summarySource = normalizeMaybeRecord(root.summary ?? root.data ?? root.dashboard);

  return {
    summary: {
      courseId: toText(
        summarySource.course_id ?? summarySource.courseId ?? fallbackCourse?.id,
        fallbackCourse?.id ?? 'course'
      ),
      courseTitle: toText(
        summarySource.course_title ?? summarySource.courseTitle ?? fallbackCourse?.title,
        fallbackCourse?.title ?? 'Selected course'
      ),
      totalLearners: Math.max(
        0,
        Math.round(
          toNumber(
            summarySource.total_learners ?? summarySource.totalLearners,
            fallbackCourse?.learnerCount ?? 0
          )
        )
      ),
      activeLearners: Math.max(
        0,
        Math.round(toNumber(summarySource.active_learners ?? summarySource.activeLearners, 0))
      ),
      completedLearners: Math.max(
        0,
        Math.round(
          toNumber(summarySource.completed_learners ?? summarySource.completedLearners, 0)
        )
      ),
      averageProgress: clampPercentage(
        toNumber(
          summarySource.average_progress ?? summarySource.averageProgress,
          fallbackCourse?.completionRate ?? 0
        )
      ),
      averageScore: clampPercentage(
        toNumber(
          summarySource.average_score ?? summarySource.averageScore,
          fallbackCourse?.averageScore ?? 0
        )
      ),
      completionRate: clampPercentage(
        toNumber(
          summarySource.completion_rate ?? summarySource.completionRate,
          fallbackCourse?.completionRate ?? 0
        )
      ),
      certificatesIssued: Math.max(
        0,
        Math.round(
          toNumber(summarySource.certificates_issued ?? summarySource.certificatesIssued, 0)
        )
      ),
    },
    modules: normalizeInstructorModules(
      root.modules ?? root.module_metrics ?? root.moduleMetrics ?? root.performance ?? root.modulePerformance
    ),
    topLearners: normalizeInstructorTopLearners(
      root.top_learners ?? root.topLearners ?? root.learners ?? root.learner_progress ?? root.learnerProgress
    ),
    recentActivity: normalizeRecentActivity(
      root.recent_activity ?? root.recentActivity ?? root.activity ?? root.events
    ),
  };
};

export const buildInstructorDashboardStats = (
  courses: InstructorCourse[],
  summary?: InstructorDashboardData['summary'] | null
): InstructorDashboardStats => {
  const coursesManaged = courses.length;
  const totalLearners = summary?.totalLearners ?? courses.reduce((total, course) => total + course.learnerCount, 0);

  return {
    coursesManaged,
    totalLearners,
    activeLearners: summary?.activeLearners ?? 0,
    completedLearners: summary?.completedLearners ?? 0,
    averageScore: summary?.averageScore ?? 0,
  };
};
