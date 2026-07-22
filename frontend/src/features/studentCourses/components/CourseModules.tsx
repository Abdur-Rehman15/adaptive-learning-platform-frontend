import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import { fetchCourseModules } from '../api/studentCourses.api';
import { QuizLauncher } from '@/features/quiz-attempt/components/QuizLauncher';

interface CourseModulesProps {
  courseId: number;
  isEnrolled: boolean;
}

export const CourseModules = ({ courseId, isEnrolled }: CourseModulesProps) => {
  const { token } = useAuth();

  const { data: modules = [], isLoading, error } = useQuery({
    queryKey: ['student-courses', 'modules', courseId, token],
    queryFn: () => fetchCourseModules(token as string, courseId),
    enabled: Boolean(token && courseId),
  });

  if (isLoading) {
    return (
      <div style={{ marginTop: '16px', borderTop: '2px dashed var(--color-border)', paddingTop: '16px' }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--color-ink-soft)', margin: 0 }}>
          RETRIEVING SYLLABUS…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ marginTop: '16px', borderTop: '2px dashed var(--color-border)', paddingTop: '16px' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-danger)', margin: 0 }}>
          Failed to load course syllabus.
        </p>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div style={{ marginTop: '16px', borderTop: '2px dashed var(--color-border)', paddingTop: '16px' }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-soft)', fontStyle: 'italic', margin: 0 }}>
          No modules published for this course yet.
        </p>
      </div>
    );
  }

  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  return (
    <div style={{ marginTop: '20px', borderTop: '2px dashed var(--color-border)', paddingTop: '16px' }}>
      <h4 style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 700,
        margin: '0 0 12px 0',
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
      }}>
        Course Syllabus ({sortedModules.length} {sortedModules.length === 1 ? 'Module' : 'Modules'})
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sortedModules.map((module) => (
          <div
            key={module.id}
            style={{
              border: '2px solid var(--color-border)',
              borderRadius: '8px',
              background: 'var(--color-surface-sunken)',
              overflow: 'hidden',
            }}
          >
            {/* Module header row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
              }}
            >
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                flexShrink: 0,
              }}>
                [{String(module.order).padStart(2, '0')}]
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, flex: 1 }}>
                {module.title}
              </span>
              {module.content_url && (
                <a
                  href={module.content_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.6875rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    border: '1px solid var(--color-primary)',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    flexShrink: 0,
                  }}
                  aria-label={`Open lesson content for ${module.title}`}
                >
                  ↗ Lesson
                </a>
              )}
            </div>

            {/* Quiz launcher row — only loaded for enrolled courses */}
            {isEnrolled && (
              <div style={{ borderTop: '1px dashed var(--color-border)', padding: '10px 12px' }}>
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
    </div>
  );
};
