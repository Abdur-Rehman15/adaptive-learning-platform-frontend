import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import { fetchCourseModules } from '../api/studentCourses.api';
import { QuizLauncher } from '@/features/quiz-attempt/components/QuizLauncher';

interface CourseModulesProps {
  courseId: number;
  isEnrolled: boolean;
  inlineQuizLauncher?: boolean;
}

export const CourseModules = ({ courseId, isEnrolled, inlineQuizLauncher = false }: CourseModulesProps) => {
  const { token } = useAuth();

  const { data: modules = [], isLoading, error } = useQuery({
    queryKey: ['student-courses', 'modules', courseId, token],
    queryFn: () => fetchCourseModules(token as string, courseId),
    enabled: Boolean(token && courseId),
  });

  if (isLoading) {
    return <p className="syllabus-loading">RETRIEVING SYLLABUS…</p>;
  }

  if (error) {
    return (
      <p className="syllabus-empty" style={{ color: 'var(--color-danger)' }}>
        Failed to load course syllabus.
      </p>
    );
  }

  if (modules.length === 0) {
    return (
      <p className="syllabus-empty" style={{ fontStyle: 'italic' }}>
        No modules published for this course yet.
      </p>
    );
  }

  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  return (
    <div className="syllabus-section">
      <h4 className="syllabus-section__title">
        Course Syllabus · {sortedModules.length} {sortedModules.length === 1 ? 'Module' : 'Modules'}
      </h4>

      {sortedModules.map((module) => (
        <div key={module.id} className="syllabus-module">
          <div className="syllabus-module__row">
            <div className="syllabus-module__info">
              <span className="syllabus-module__index">
                {String(module.order).padStart(2, '0')}
              </span>
              <span className="syllabus-module__title">{module.title}</span>
            </div>

            <div className="syllabus-module__actions">
              {isEnrolled && module.content_url && (
                <a
                  href={module.content_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="syllabus-module__lesson-link"
                  aria-label={`Open lesson content for ${module.title}`}
                >
                  ↗ Lesson
                </a>
              )}

              {isEnrolled && inlineQuizLauncher && (
                <QuizLauncher
                  moduleId={module.id}
                  moduleTitle={module.title}
                  moduleOrder={module.order}
                  compact
                />
              )}
            </div>
          </div>

          {isEnrolled && !inlineQuizLauncher && (
            <div className="syllabus-module__quiz-row">
              <QuizLauncher
                moduleId={module.id}
                moduleTitle={module.title}
                moduleOrder={module.order}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
