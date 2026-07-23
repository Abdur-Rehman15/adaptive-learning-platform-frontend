import type { StudentCourse } from '../types/studentCourses.types';
import { CourseModules } from './CourseModules';
import { CertificateDownload } from '@/features/quiz-attempt/components/CertificateDownload';

interface MyLearningCourseDetailProps {
  course: StudentCourse;
}

const ProgressRing = ({
  percent,
  color = 'var(--learner-blue)',
  label,
}: {
  percent: number;
  color?: string;
  label: string;
}) => {
  const size = 128;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="ml-progress-ring">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="ml-progress-ring__arc"
        />
      </svg>
      <div className="ml-progress-ring__center">
        <span className="ml-progress-ring__value" style={{ color }}>
          {clamped}%
        </span>
        <span className="ml-progress-ring__label">{label}</span>
      </div>
    </div>
  );
};

export const MyLearningCourseDetail = ({ course }: MyLearningCourseDetailProps) => {
  const progress = course.progressPercent ?? 0;
  const isComplete = progress === 100;
  const ringColor = isComplete ? 'var(--learner-green)' : 'var(--learner-blue)';

  return (
    <div className="ml-detail-column">
      <section className="dashboard-panel ml-detail-header">
        <div className="ml-detail-header__top">
          <div className="ml-detail-header__info">
            <p className="dashboard-panel__eyebrow ml-eyebrow">
              {isComplete ? 'Course Complete' : 'Active Track'}
            </p>
            <h2 className="ml-detail-header__title">{course.title}</h2>
            <p className="ml-detail-header__meta">
              Instructor: {course.created_by}
            </p>
            <p className="ml-detail-header__desc">{course.description}</p>
          </div>

          <div className="ml-detail-header__ring-wrap">
            <ProgressRing percent={progress} color={ringColor} label="Progress" />
            {isComplete ? (
              <span className="ml-detail-header__badge ml-detail-header__badge--complete">
                Certified
              </span>
            ) : (
              <span className="ml-detail-header__badge ml-detail-header__badge--active">
                {100 - progress}% to go
              </span>
            )}
          </div>
        </div>

        <div className="ml-detail-header__actions">
          {isComplete ? (
            <CertificateDownload
              courseId={course.id}
              courseTitle={course.title}
              compact
            />
          ) : (
            <div className="ml-cert-locked">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="4" y="8" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>Complete all module quizzes to unlock your certificate</span>
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-panel ml-syllabus-panel">
        <div className="dashboard-panel__header">
          <div>
            <p className="dashboard-panel__eyebrow ml-eyebrow">Syllabus</p>
            <h2 className="dashboard-panel__title">Modules & Quizzes</h2>
          </div>
          <p className="dashboard-panel__description">
            Study lesson content and attempt quizzes to advance.
          </p>
        </div>

        <CourseModules courseId={course.id} isEnrolled inlineQuizLauncher />
      </section>
    </div>
  );
};
