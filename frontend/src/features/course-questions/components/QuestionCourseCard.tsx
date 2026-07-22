import type { CourseResponse } from '@/features/admin-dashboard/api/adminCourse.api';
import { useCourseModules } from '@/features/admin-dashboard/hooks/useCreateCourse';

interface QuestionCourseCardProps {
  course: CourseResponse;
  isSelected: boolean;
  onClick: () => void;
}

export const QuestionCourseCard = ({
  course,
  isSelected,
  onClick,
}: QuestionCourseCardProps) => {
  const { data: modules } = useCourseModules(course.id);
  const moduleCount = modules ? modules.length : null;

  const truncatedDesc =
    course.description.length > 100
      ? course.description.slice(0, 100) + '…'
      : course.description;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`q-course-card${isSelected ? ' q-course-card--selected' : ''}`}
    >
      <div className="q-course-card__badge-row">
        <span className="q-badge q-badge--id">
          ID #{course.id}
        </span>
        {moduleCount !== null && (
          <span className="q-badge q-badge--module-count">
            {moduleCount} {moduleCount === 1 ? 'module' : 'modules'}
          </span>
        )}
      </div>

      <h3 className="q-course-card__title">{course.title}</h3>

      <p className="q-course-card__desc">{truncatedDesc}</p>

      <div className="q-course-card__footer">
        <span className="q-course-card__author">
          by {course.created_by}
        </span>
        <span className="q-course-card__cta">
          {isSelected ? 'Viewing →' : 'View modules →'}
        </span>
      </div>
    </button>
  );
};