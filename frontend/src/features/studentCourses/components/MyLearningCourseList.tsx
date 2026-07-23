import type { StudentCourse } from '../types/studentCourses.types';

type FilterTab = 'all' | 'active' | 'completed';

interface MyLearningCourseListProps {
  courses: StudentCourse[];
  selectedCourseId: number | null;
  filter: FilterTab;
  onFilterChange: (filter: FilterTab) => void;
  onSelectCourse: (courseId: number) => void;
}

const FILTER_OPTIONS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
];

export const MyLearningCourseList = ({
  courses,
  selectedCourseId,
  filter,
  onFilterChange,
  onSelectCourse,
}: MyLearningCourseListProps) => {
  return (
    <section className="dashboard-panel ml-course-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="dashboard-panel__eyebrow ml-eyebrow">Your Tracks</p>
          <h2 className="dashboard-panel__title">Enrolled Courses</h2>
        </div>
        <p className="dashboard-panel__description">
          {courses.length} course{courses.length !== 1 ? 's' : ''} in your workspace
        </p>
      </div>

      <div className="ml-filter-tabs" role="tablist" aria-label="Filter courses">
        {FILTER_OPTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filter === id}
            className={`ml-filter-tab${filter === id ? ' ml-filter-tab--active' : ''}`}
            onClick={() => onFilterChange(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="ml-course-list">
        {courses.length === 0 ? (
          <p className="ml-course-list__empty">No courses match this filter.</p>
        ) : (
          courses.map((course) => {
            const progress = course.progressPercent ?? 0;
            const isSelected = course.id === selectedCourseId;
            const isComplete = progress === 100;

            return (
              <button
                key={course.id}
                type="button"
                className={`ml-course-row${isSelected ? ' ml-course-row--selected' : ''}`}
                onClick={() => onSelectCourse(course.id)}
              >
                <span className="ml-course-row__dot" aria-hidden="true" />
                <div className="ml-course-row__info">
                  <span className="ml-course-row__title">{course.title}</span>
                  <span
                    className={`ml-course-row__status ml-course-row__status--${isComplete ? 'completed' : 'active'}`}
                  >
                    {isComplete ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                <span className="ml-course-row__progress-pill" aria-hidden="true">
                  <span
                    className="ml-course-row__progress-fill"
                    style={{
                      width: `${progress}%`,
                      background: isComplete ? 'var(--learner-green)' : 'var(--learner-blue)',
                    }}
                  />
                </span>
                <span className="ml-course-row__percent">{progress}%</span>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
};
