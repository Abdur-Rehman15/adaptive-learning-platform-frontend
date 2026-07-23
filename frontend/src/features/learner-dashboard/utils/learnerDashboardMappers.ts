import type {
  LearnerCourseSummary,
  LearnerDashboardStats,
  LearnerEnrollment,
  LearnerScoreTrend,
} from '../types/learnerDashboard.types';

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

const toBoolean = (value: unknown, fallback: boolean) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
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

export const normalizeEnrollments = (
  rawValue: unknown
): LearnerEnrollment[] => {
  return normalizeList(rawValue).map((item, index) => {
    const entry = isRecord(item) ? item : {};
    const course = isRecord(entry.course) ? entry.course : undefined;

    const courseId = toText(
      entry.course_id ?? entry.courseId ?? course?.id ?? index + 1,
      `course-${index + 1}`
    );

    return {
      id: toText(entry.id ?? `${courseId}-${index}`, `${courseId}-${index}`),
      courseId,
      courseTitle: toText(
        course?.title ?? entry.course_title ?? entry.courseTitle ?? entry.title,
        `Course ${index + 1}`
      ),
      status: toText(entry.status, 'In progress'),
      progressPercent: clampPercentage(
        toNumber(
          entry.progress_percent ?? entry.progressPercent ?? course?.progress,
          0
        )
      ),
    };
  });
};

export const normalizeCourseSummary = (
  rawValue: unknown,
  fallbackCourse?: LearnerEnrollment
): LearnerCourseSummary => {
  const entry = isRecord(rawValue) ? rawValue : {};

  const courseTitle = toText(
    entry.course_title ?? entry.courseTitle ?? entry.title,
    fallbackCourse?.courseTitle ?? 'Selected course'
  );

  // Backend returns: course_id, progress_percent, average_quiz_score, weakest_topics
  const rawWeakestTopics = entry.weakest_topics ?? entry.weakestTopics;
  const weakestTopics: string[] = Array.isArray(rawWeakestTopics)
    ? rawWeakestTopics.filter((t): t is string => typeof t === 'string')
    : [];

  return {
    courseId: toText(
      entry.course_id ?? entry.courseId ?? fallbackCourse?.courseId,
      fallbackCourse?.courseId ?? 'course'
    ),
    courseTitle,
    progressPercent: clampPercentage(
      toNumber(entry.progress_percent ?? entry.progressPercent, fallbackCourse?.progressPercent ?? 0)
    ),
    averageScore: clampPercentage(
      toNumber(
        entry.average_quiz_score ?? entry.average_score ?? entry.averageScore ?? entry.final_score ?? entry.score,
        0
      )
    ),
    weakestTopics,
  };
};

export const normalizeScoreTrends = (rawValue: unknown): LearnerScoreTrend[] => {
  // The backend returns one entry per quiz attempt (ordered oldest → newest).
  // Multiple attempts on the same module inflate the count, so we deduplicate
  // by module title — keeping the *latest* score (last write wins).
  const latestByModule = new Map<string, number>();

  normalizeList(rawValue).forEach((item, index) => {
    const entry = isRecord(item) ? item : {};
    const label = toText(
      entry.module_title ??
        entry.moduleTitle ??
        entry.label ??
        entry.module ??
        entry.name ??
        entry.attempt_date ??
        entry.date,
      `Module ${index + 1}`
    );
    const score = clampPercentage(
      toNumber(entry.final_score ?? entry.score ?? entry.average_score ?? entry.averageScore ?? entry.value, 0)
    );
    // Overwrite: since attempts are ordered asc by completed_at, the last
    // overwrite per module_title is the most recent attempt.
    latestByModule.set(label, score);
  });

  return Array.from(latestByModule.entries()).map(([label, score]) => ({ label, score }));
};

export const buildDashboardStats = (
  enrollments: LearnerEnrollment[]
): LearnerDashboardStats => {
  const enrolledCourses = enrollments.length;
  const completedCourses = enrollments.filter(({ status }) =>
    status.toLowerCase().includes('complete')
  ).length;
  const activeCourses = enrollments.filter(({ status }) => {
    const lowerCaseStatus = status.toLowerCase();
    return lowerCaseStatus.includes('progress') || lowerCaseStatus.includes('active');
  }).length;
  const averageProgress = enrolledCourses
    ? Math.round(
        enrollments.reduce((total, enrollment) => total + enrollment.progressPercent, 0) /
          enrolledCourses
      )
    : 0;

  return {
    enrolledCourses,
    activeCourses,
    completedCourses,
    averageProgress,
  };
};
