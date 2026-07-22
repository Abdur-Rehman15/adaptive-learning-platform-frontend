import type { InstructorCourse } from '../types/adminDashboard.types';

interface AdminCourseSelectorProps {
  courses: InstructorCourse[];
  selectedCourseId: string | null;
  onSelectCourse: (courseId: string) => void;
}

export const AdminCourseSelector = ({
  courses,
  selectedCourseId,
  onSelectCourse,
}: AdminCourseSelectorProps) => {
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="dashboard-panel__eyebrow" style={{ color: 'var(--color-accent)' }}>Course Catalog</p>
          <h2 className="dashboard-panel__title">Your Authored Courses</h2>
        </div>
        <p className="dashboard-panel__description">
          Select a course to inspect active student enrollment performance.
        </p>
      </div>

      <div className="dashboard-course-list">
        {courses.map((course) => {
          const isSelected = course.id === selectedCourseId;

          return (
            <button
              key={course.id}
              type="button"
              className={`dashboard-course-card ${isSelected ? 'dashboard-course-card--selected' : ''}`}
              style={{
                borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border)',
              }}
              onClick={() => onSelectCourse(course.id)}
            >
              <div className="dashboard-course-card__topline">
                <span className="dashboard-course-card__title">{course.title}</span>
                <span 
                  className="dashboard-course-card__status"
                  style={{
                    background: 'rgba(225, 29, 72, 0.1)',
                    color: 'var(--color-accent)',
                    border: '1px solid var(--color-accent)'
                  }}
                >
                  Admin
                </span>
              </div>

              <div className="dashboard-progress dashboard-progress--soft" style={{ margin: '12px 0' }}>
                <div
                  className="dashboard-progress__fill"
                  style={{ 
                    width: `${course.completionRate}%`,
                    background: 'var(--color-accent)'
                  }}
                />
              </div>

              <div className="dashboard-course-card__bottomline">
                <span>ID: {course.id}</span>
                <span>{course.learnerCount} learners</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
