import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { EditCoursePanel } from './EditCoursePanel';
import { CourseModulesEditor } from './CourseModulesEditor';
import type { InstructorCourse } from '../types/adminDashboard.types';

type PanelMode = 'edit' | 'modules' | null;

interface CourseCardProps {
  course: InstructorCourse;
  isExpanded: boolean;
  panelMode: PanelMode;
  onTogglePanel: (mode: PanelMode) => void;
}

const CourseCard = ({ course, isExpanded, panelMode, onTogglePanel }: CourseCardProps) => {
  const courseNumericId = Number(course.id);

  return (
    <article
      className={`admin-course-card ${
        isExpanded ? 'admin-course-card--expanded' : 'admin-course-card--collapsed'
      }`}
    >
      {/* Card Header */}
      <div className="admin-course-card__header">
        {/* Absolute floating badge */}
        <span className="admin-course-card__badge">
          Authored Course
        </span>

        <div style={{ marginTop: '10px' }}>
          <h3 className="admin-course-card__title">{course.title}</h3>
          <p className="admin-course-card__meta">
            COURSE ID: {course.id} · COHORT: {course.learnerCount} students
          </p>
          <p className="admin-course-card__description">
            {course.description || 'No course syllabus description provided yet.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="admin-course-card__actions">
          <button
            type="button"
            className={`dashboard-btn ${
              panelMode === 'edit' && isExpanded ? 'dashboard-btn--accent' : 'dashboard-btn--sunken'
            }`}
            style={{ fontSize: '0.8rem', padding: '8px 16px' }}
            onClick={() => onTogglePanel(panelMode === 'edit' ? null : 'edit')}
          >
            {panelMode === 'edit' && isExpanded ? '✕ Close Edit' : '✎ Edit Course'}
          </button>
          <button
            type="button"
            className={`dashboard-btn ${
              panelMode === 'modules' && isExpanded ? 'dashboard-btn--primary' : 'dashboard-btn--sunken'
            }`}
            style={{ fontSize: '0.8rem', padding: '8px 16px' }}
            onClick={() => onTogglePanel(panelMode === 'modules' ? null : 'modules')}
          >
            {panelMode === 'modules' && isExpanded ? '✕ Close Modules' : '⊞ Manage Modules'}
          </button>
        </div>
      </div>

      {/* Expandable Panel */}
      {isExpanded && panelMode && (
        <div
          style={{
            borderTop: '2px solid var(--color-border)',
            background: 'var(--color-surface-sunken)',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {panelMode === 'edit' && <EditCoursePanel course={course} />}
          {panelMode === 'modules' && Number.isFinite(courseNumericId) && (
            <CourseModulesEditor courseId={courseNumericId} />
          )}
        </div>
      )}
    </article>
  );
};

export const AdminCoursesView = () => {
  const { courses, isLoadingCourses, coursesError } = useAdminDashboard();
  const navigate = useNavigate();

  // Track which course has an open panel
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activePanelMode, setActivePanelMode] = useState<PanelMode>(null);

  const handleTogglePanel = (courseId: string, mode: PanelMode) => {
    if (activeCourseId === courseId && activePanelMode === mode) {
      // Close if same
      setActiveCourseId(null);
      setActivePanelMode(null);
    } else {
      setActiveCourseId(courseId);
      setActivePanelMode(mode);
    }
  };

  if (isLoadingCourses) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem' }}>LOADING COURSES…</p>
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="auth-card" style={{ margin: '48px auto', textAlign: 'center' }}>
        <p className="auth-card__error">Error loading courses: {coursesError.message}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Page Header Banner */}
      <section className="admin-hero">
        <div>
          <p className="admin-hero__eyebrow">Instructor Console</p>
          <h1 className="admin-hero__title">Course Management</h1>
          <p className="admin-hero__subtitle">
            {courses.length > 0
              ? `${courses.length} course${courses.length !== 1 ? 's' : ''} authored — edit, manage modules, and track metrics.`
              : 'No courses yet. Create your first course to get started.'}
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => navigate('/courses/create')}
            className="dashboard-btn dashboard-btn--accent"
            style={{ whiteSpace: 'nowrap' }}
          >
            + Create New Course
          </button>
        </div>
      </section>

      {/* Course List */}
      {courses.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {courses.map((course) => {
            const isExpanded = activeCourseId === course.id;
            const panelMode = isExpanded ? activePanelMode : null;

            return (
              <CourseCard
                key={course.id}
                course={course}
                isExpanded={isExpanded}
                panelMode={panelMode}
                onTogglePanel={(mode) => handleTogglePanel(course.id, mode)}
              />
            );
          })}
        </div>
      ) : (
        <section className="dashboard-empty">
          <p className="dashboard-empty__eyebrow">No Courses Found</p>
          <h2 className="dashboard-empty__title">You haven't created any courses yet.</h2>
          <p className="dashboard-empty__text">
            Author a course, add modules, and configure quizzes. Once learners enroll, you'll see metrics and progress here.
          </p>
          <button
            onClick={() => navigate('/courses/create')}
            className="dashboard-btn dashboard-btn--accent"
            style={{ marginTop: '12px' }}
          >
            + Create Your First Course
          </button>
        </section>
      )}
    </div>
  );
};
