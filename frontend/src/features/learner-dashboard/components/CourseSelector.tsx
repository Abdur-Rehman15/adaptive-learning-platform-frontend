import type { LearnerEnrollment } from '../types/learnerDashboard.types';

interface CourseSelectorProps {
  enrollments: LearnerEnrollment[];
  selectedCourseId: string | null;
  onSelectCourse: (courseId: string) => void;
}

const statusVariant = (status: string): 'active' | 'completed' | 'default' => {
  const lower = status.toLowerCase();
  if (lower.includes('complete')) return 'completed';
  if (lower.includes('progress') || lower.includes('active')) return 'active';
  return 'default';
};

export const CourseSelector = ({
  enrollments,
  selectedCourseId,
  onSelectCourse,
}: CourseSelectorProps) => {
  return (
    <section className="dashboard-panel learner-course-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="dashboard-panel__eyebrow">Course focus</p>
          <h2 className="dashboard-panel__title">Your enrolled courses</h2>
        </div>
      </div>

      <div className="learner-course-list">
        {enrollments.map((enrollment) => {
          const isSelected = enrollment.courseId === selectedCourseId;
          const variant = statusVariant(enrollment.status);

          return (
            <button
              key={enrollment.id}
              type="button"
              className={`learner-course-row ${isSelected ? 'learner-course-row--selected' : ''}`}
              onClick={() => onSelectCourse(enrollment.courseId)}
            >
              <span className="learner-course-row__dot" aria-hidden="true" />
              <span className="learner-course-row__title">{enrollment.courseTitle}</span>
              <span
                className={`learner-course-row__status learner-course-row__status--${variant}`}
              >
                {enrollment.status}
              </span>
              <span className="learner-course-row__progress-pill">
                <span
                  className="learner-course-row__progress-fill"
                  style={{ width: `${enrollment.progressPercent}%` }}
                />
              </span>
              <span className="learner-course-row__percent">
                {enrollment.progressPercent}%
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
