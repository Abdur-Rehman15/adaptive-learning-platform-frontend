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
    <section className="dashboard-panel admin-course-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="dashboard-panel__eyebrow admin-eyebrow">Course Catalog</p>
          <h2 className="dashboard-panel__title">Your Courses</h2>
        </div>
        <p className="dashboard-panel__description">
          {courses.length} course{courses.length !== 1 ? 's' : ''} · select to inspect analytics
        </p>
      </div>

      <div className="admin-course-list">
        {courses.map((course) => {
          const isSelected = course.id === selectedCourseId;

          return (
            <button
              key={course.id}
              type="button"
              onClick={() => onSelectCourse(course.id)}
              className={`admin-course-item${isSelected ? ' admin-course-item--selected' : ''}`}
            >
              <span className="admin-course-item__dot" aria-hidden="true" />
              <div className="admin-course-item__info">
                <span className="admin-course-item__title">{course.title}</span>
                <span className="admin-course-item__meta">
                  {course.learnerCount} learner{course.learnerCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="admin-course-item__stats">
                <div className="admin-course-item__progress-pill" aria-hidden="true">
                  <span
                    className="admin-course-item__progress-fill"
                    style={{ width: `${course.completionRate}%` }}
                  />
                </div>
                <span className="admin-course-item__percent">
                  {course.completionRate}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
