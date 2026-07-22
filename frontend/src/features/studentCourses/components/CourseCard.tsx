import { useNavigate } from 'react-router-dom';
import type { StudentCourse } from '../types/studentCourses.types';
import { CourseModules } from './CourseModules';
import { CertificateDownload } from '@/features/quiz-attempt/components/CertificateDownload';

interface CourseCardProps {
  course: StudentCourse;
  onEnroll: (courseId: number) => void;
  isEnrolling: boolean;
  userRole: 'user' | 'admin' | null;
}

export const CourseCard = ({
  course,
  onEnroll,
  isEnrolling,
  userRole,
}: CourseCardProps) => {
  const navigate = useNavigate();

  return (
    <article
      className="dashboard-panel student-course-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      <style>{`
        .student-course-card {
          transition: transform 150ms ease, box-shadow 150ms ease;
        }
        .student-course-card:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px 0px var(--color-border) !important;
        }
      `}</style>

      <div>
        {/* Role/Category badge sitting half-outside the top edge */}
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            left: '20px',
            background: course.isEnrolled ? 'var(--color-success)' : 'var(--color-primary)',
            color: '#ffffff',
            border: '2px solid var(--color-border)',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {course.isEnrolled ? 'Enrolled' : 'Available'}
        </div>

        <div style={{ marginTop: '8px' }}>
          <h3
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '1.25rem',
              fontWeight: 700,
              margin: '0 0 8px 0',
              lineHeight: 1.2,
            }}
          >
            {course.title}
          </h3>
          <p
            style={{
              fontSize: '0.75rem',
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--color-ink-soft)',
              margin: '0 0 12px 0',
            }}
          >
            AUTHOR: {course.created_by} | COURSE ID: {course.id}
          </p>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-ink-soft)',
              lineHeight: 1.5,
              margin: '0 0 16px 0',
            }}
          >
            {course.description}
          </p>
        </div>

        <CourseModules courseId={course.id} isEnrolled={course.isEnrolled} />
      </div>

      <div style={{ marginTop: '24px' }}>
        {userRole === 'admin' ? (
          <button
            type="button"
            className="dashboard-btn dashboard-btn--sunken"
            style={{ width: '100%' }}
            onClick={() => navigate('/dashboard')}
          >
            Instructor View
          </button>
        ) : course.isEnrolled ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Progress header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
              <span style={{ textTransform: 'uppercase', color: 'var(--color-ink-soft)' }}>
                Progress
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {course.progressPercent}%
              </span>
            </div>
            <div className="dashboard-progress" style={{ margin: '4px 0' }}>
              <div
                className="dashboard-progress__fill"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>

            {/* Certificate section — only when 100% complete */}
            {course.progressPercent === 100 ? (
              <CertificateDownload
                courseId={course.id}
                courseTitle={course.title}
              />
            ) : (
              <button
                type="button"
                className="dashboard-btn dashboard-btn--sunken"
                style={{ width: '100%', marginTop: '8px' }}
                onClick={() => navigate('/courses')}
              >
                Continue Learning
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="dashboard-btn dashboard-btn--primary"
            style={{ width: '100%' }}
            onClick={() => onEnroll(course.id)}
            disabled={isEnrolling}
          >
            {isEnrolling ? 'Enrolling…' : 'Enroll in Course'}
          </button>
        )}
      </div>
    </article>
  );
};
