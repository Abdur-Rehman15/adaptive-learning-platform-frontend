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
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());

    const matchesTab =
      filter === 'all' ||
      (filter === 'enrolled' && course.isEnrolled) ||
      (filter === 'available' && !course.isEnrolled);

    return matchesSearch && matchesTab;
  });

  const handleEnroll = (courseId: number) => {
    enroll(courseId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Catalog Welcome & Information Header */}
      <div 
        className="dashboard-panel"
        style={{ 
          padding: '32px', 
          background: 'var(--color-surface)',
          position: 'relative'
        }}
      >
        <div 
          style={{ 
            position: 'absolute', 
            top: '-14px', 
            left: '24px', 
            background: 'var(--color-primary)', 
            color: '#ffffff', 
            border: '2px solid var(--color-border)', 
            borderRadius: '4px', 
            padding: '4px 10px', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            letterSpacing: '0.05em', 
            textTransform: 'uppercase' 
          }}
        >
          Course Catalog
        </div>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
            Explore Available Curriculums
          </h1>
          <p style={{ color: 'var(--color-ink-soft)', margin: 0 }}>
            Browse published courses, inspect sequential lesson syllabus, and allocate them to your active student workspace.
          </p>
        </div>
      </div>

      {/* Search & Filter Control Panel */}
      <div 
        className="dashboard-panel" 
        style={{ 
          padding: '24px', 
          display: 'flex', 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '24px',
          flexWrap: 'wrap'
        }}
      >
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {(['all', 'enrolled', 'available'] as const).map((tab) => {
            const isActive = filter === tab;
            const labels = {
              all: 'All Courses',
              enrolled: 'My Enrollments',
              available: 'Available to Enroll',
            };
            return (
              <button
                key={tab}
                type="button"
                className={`dashboard-btn ${isActive ? 'dashboard-btn--primary' : 'dashboard-btn--sunken'}`}
                onClick={() => setFilter(tab)}
                style={{ padding: '8px 16px', fontSize: '0.75rem' }}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '260px', flex: '1', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Search courses by keyword…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid var(--color-border)',
              borderRadius: '8px',
              background: 'var(--color-surface-sunken)',
              fontFamily: 'Spline Sans, sans-serif',
              fontSize: '0.875rem',
              color: 'var(--color-ink)',
            }}
          />
        </div>
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
