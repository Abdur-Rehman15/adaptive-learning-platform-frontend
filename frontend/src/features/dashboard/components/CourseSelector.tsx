import type { LearnerEnrollment } from '../types/dashboard.types';

interface CourseSelectorProps {
  enrollments: LearnerEnrollment[];
  selectedCourseId: string | null;
  onSelectCourse: (courseId: string) => void;
}

export const CourseSelector = ({
  enrollments,
  selectedCourseId,
  onSelectCourse,
}: CourseSelectorProps) => {
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="dashboard-panel__eyebrow">Course focus</p>
          <h2 className="dashboard-panel__title">Your enrolled courses</h2>
        </div>
        <p className="dashboard-panel__description">
          Select a course to inspect progress, module completion, and score trend.
        </p>
      </div>

      <div className="dashboard-course-list">
        {enrollments.map((enrollment) => {
          const isSelected = enrollment.courseId === selectedCourseId;

          return (
            <button
              key={enrollment.id}
              type="button"
              className={`dashboard-course-card ${isSelected ? 'dashboard-course-card--selected' : ''}`}
              onClick={() => onSelectCourse(enrollment.courseId)}
            >
              <div className="dashboard-course-card__topline">
                <span className="dashboard-course-card__title">{enrollment.courseTitle}</span>
                <span className="dashboard-course-card__status">{enrollment.status}</span>
              </div>

              <div className="dashboard-progress">
                <div
                  className="dashboard-progress__fill"
                  style={{ width: `${enrollment.progressPercent}%` }}
                />
              </div>

              <div className="dashboard-course-card__bottomline">
                <span>Course ID {enrollment.courseId}</span>
                <span>{enrollment.progressPercent}% complete</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};