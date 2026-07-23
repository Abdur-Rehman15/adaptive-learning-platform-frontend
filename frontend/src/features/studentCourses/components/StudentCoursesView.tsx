import { useState } from 'react';
import { useStudentCourses } from '../hooks/useStudentCourses';
import { CourseCard } from './CourseCard';
import { useAuth } from '@/features/auth/context/AuthContext';

type FilterType = 'all' | 'enrolled' | 'available';

export const StudentCoursesView = () => {
  const { role } = useAuth();
  const { courses, isLoading, error, enroll, enrollingCourseId, enrollError } = useStudentCourses();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem' }}>SYNCING CATALOG STATE…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-card" style={{ margin: '48px auto', textAlign: 'center' }}>
        <p className="auth-card__error">Error loading catalog: {error.message}</p>
      </div>
    );
  }

  const filteredCourses = courses.filter((course) => {
    // Only available to enroll (NOT enrolled yet!)
    if (course.isEnrolled) return false;

    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  const handleEnroll = (courseId: number) => {
    enroll(courseId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Catalog Welcome & Information Header */}
      <section className="catalog-hero">
        <p className="catalog-hero__eyebrow">Course Catalog</p>
        <h1 className="catalog-hero__title">Explore Available Curriculums</h1>
        <p className="catalog-hero__subtitle">
          Browse published courses, inspect sequential lesson syllabus, and allocate them to your active student workspace.
        </p>
      </section>

      {/* Search & Filter Control Panel */}
      <div className="catalog-search-container">
        <div className="catalog-search-wrap">
          <span className="catalog-search-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M9 17A8 8 0 109 1a8 8 0 000 16zM15 15l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="text"
            className="catalog-search-input"
            placeholder="Search available courses by keyword…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {filteredCourses.length > 0 && (
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--color-ink-soft)',
            fontFamily: 'JetBrains Mono, monospace',
            background: 'var(--color-surface-sunken)',
            padding: '8px 12px',
            border: '2px solid var(--color-border)',
            borderRadius: '8px',
            whiteSpace: 'nowrap'
          }}>
            {filteredCourses.length} COURSE{filteredCourses.length !== 1 ? 'S' : ''} FOUND
          </div>
        )}
      </div>

      {enrollError && (
        <div 
          className="dashboard-panel" 
          style={{ 
            borderColor: 'var(--color-danger)', 
            background: 'rgba(220, 38, 38, 0.05)', 
            padding: '16px 24px' 
          }}
        >
          <p style={{ margin: 0, color: 'var(--color-danger)', fontWeight: 600, fontSize: '0.875rem' }}>
            Enrollment failed: {enrollError.message}
          </p>
        </div>
      )}

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '32px' 
          }}
        >
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={handleEnroll}
              isEnrolling={enrollingCourseId === course.id}
              userRole={role}
            />
          ))}
        </div>
      ) : (
        <section className="dashboard-empty">
          <p className="dashboard-empty__eyebrow">Zero Records</p>
          <h2 className="dashboard-empty__title">No courses found</h2>
          <p className="dashboard-empty__text">
            There are no courses matching your search keyword or selected catalog filters.
          </p>
        </section>
      )}
    </div>
  );
};
