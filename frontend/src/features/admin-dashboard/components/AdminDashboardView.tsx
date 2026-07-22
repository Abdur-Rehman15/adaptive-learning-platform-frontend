import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { AdminCourseSelector } from './AdminCourseSelector';
import { ModuleMetricsList } from './ModuleMetricsList';
import { LearnerProgressTable } from './LearnerProgressTable';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AdminDashboardView = () => {
  const {
    user,
    courses,
    selectedCourseId,
    setSelectedCourseId,
    selectedCourse,
    dashboardStats,
    dashboardData,
    isLoadingCourses,
    isLoadingDashboard,
    coursesError,
  } = useAdminDashboard();

  const { clearSession } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  if (isLoadingCourses) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem' }}>SYNCING INSTRUCTOR WORKSPACE…</p>
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="auth-card" style={{ margin: '48px auto', textAlign: 'center' }}>
        <p className="auth-card__error">Error loading instructor courses: {coursesError.message}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome & User Details Banner */}
      <div 
        style={{ 
          border: '2px solid var(--color-border)', 
          borderRadius: '16px', 
          padding: '32px', 
          background: 'var(--color-surface)',
          boxShadow: '4px 4px 0px 0px var(--color-border)',
          position: 'relative'
        }}
      >
        <div 
          style={{ 
            position: 'absolute', 
            top: '-14px', 
            left: '24px', 
            background: 'var(--color-accent)', 
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
          Instructor Console
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
              Welcome back, {user?.username}
            </h1>
            <p style={{ color: 'var(--color-ink-soft)', margin: 0 }}>
              Monitor course metrics, curriculum delivery progress, and student grades.
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="dashboard-btn dashboard-btn--accent"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Global Instructor Stats readouts */}
      {courses.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <article className="dashboard-stat-card">
            <p className="dashboard-stat-card__label">Courses Managed</p>
            <p className="dashboard-stat-card__value">{dashboardStats.coursesManaged}</p>
            <p className="dashboard-stat-card__meta">Total course syllabi authored</p>
          </article>
          
          <article className="dashboard-stat-card">
            <p className="dashboard-stat-card__label">Total Learners</p>
            <p className="dashboard-stat-card__value">{dashboardStats.totalLearners}</p>
            <p className="dashboard-stat-card__meta">Enrolled across all courses</p>
          </article>

          <article className="dashboard-stat-card" style={{ borderColor: 'var(--color-accent)' }}>
            <p className="dashboard-stat-card__label">Active Progressing</p>
            <p className="dashboard-stat-card__value">{dashboardStats.activeLearners}</p>
            <p className="dashboard-stat-card__meta">Learners with active sessions</p>
          </article>

          <article className="dashboard-stat-card">
            <p className="dashboard-stat-card__label">Certificates Issued</p>
            <p className="dashboard-stat-card__value">{dashboardData?.summary?.certificatesIssued ?? 0}</p>
            <p className="dashboard-stat-card__meta">Students who completed syllabus</p>
          </article>

          <article className="dashboard-stat-card">
            <p className="dashboard-stat-card__label">Cohort Avg Score</p>
            <p className="dashboard-stat-card__value">{dashboardStats.averageScore}%</p>
            <p className="dashboard-stat-card__meta">Quiz accuracy across tracks</p>
          </article>
        </div>
      )}

      {/* Course Focus grid */}
      {courses.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.2fr', gap: '32px', alignItems: 'start' }} className="responsive-dashboard-grid">
          {/* Left: course lists */}
          <AdminCourseSelector
            courses={courses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={setSelectedCourseId}
          />

          {/* Right: course analytics details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {isLoadingDashboard ? (
              <div className="dashboard-panel" style={{ padding: '48px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem' }}>SYNCING COURSE ANALYTICS…</p>
              </div>
            ) : dashboardData ? (
              <>
                {/* Course Header summary */}
                <section className="dashboard-panel">
                  <div className="dashboard-panel__header">
                    <div>
                      <p className="dashboard-panel__eyebrow" style={{ color: 'var(--color-accent)' }}>Focus Overview</p>
                      <h2 className="dashboard-panel__title">{dashboardData.summary.courseTitle} Stats</h2>
                    </div>
                    <p className="dashboard-panel__description">
                      Delivery metrics and completion summary of course ID: {dashboardData.summary.courseId}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '24px' }}>
                    <div style={{ border: '2px solid var(--color-border)', borderRadius: '8px', padding: '16px', background: 'var(--color-surface-sunken)' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-ink-soft)', marginBottom: '8px' }}>
                        Curriculum Progress
                      </p>
                      <p style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                        {dashboardData.summary.averageProgress}% <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-soft)' }}>avg progress</span>
                      </p>
                    </div>

                    <div style={{ border: '2px solid var(--color-border)', borderRadius: '8px', padding: '16px', background: 'var(--color-surface-sunken)' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-ink-soft)', marginBottom: '8px' }}>
                        Completion Rate
                      </p>
                      <p style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                        {dashboardData.summary.completionRate}% <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-soft)' }}>finished</span>
                      </p>
                    </div>

                    <div style={{ border: '2px solid var(--color-border)', borderRadius: '8px', padding: '16px', background: 'var(--color-surface-sunken)' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-ink-soft)', marginBottom: '8px' }}>
                        Average Grade
                      </p>
                      <p style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                        {dashboardData.summary.averageScore}% <span style={{ fontSize: '0.85rem', color: 'var(--color-ink-soft)' }}>quiz average</span>
                      </p>
                    </div>
                  </div>
                </section>

                {/* Modules Performance metric */}
                <ModuleMetricsList modules={dashboardData.modules} />

                {/* Enrolled Learners progress list */}
                <LearnerProgressTable learners={dashboardData.topLearners} />

                {/* Recent Activities Log */}
                {dashboardData.recentActivity.length > 0 && (
                  <section className="dashboard-panel">
                    <div className="dashboard-panel__header">
                      <div>
                        <p className="dashboard-panel__eyebrow" style={{ color: 'var(--color-accent)' }}>Logs</p>
                        <h2 className="dashboard-panel__title">Course Activity Stream</h2>
                      </div>
                      <p className="dashboard-panel__description">
                        Latest updates on student completions and quiz submissions.
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                      {dashboardData.recentActivity.map((activity, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            display: 'flex', 
                            gap: '12px', 
                            padding: '12px', 
                            border: '2px solid var(--color-border)', 
                            borderRadius: '8px',
                            background: 'var(--color-surface)' 
                          }}
                        >
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--color-accent)' }}>
                            [{String(idx + 1).padStart(2, '0')}]
                          </span>
                          <span style={{ fontSize: '0.9rem' }}>{activity}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : (
              <div className="dashboard-panel" style={{ padding: '48px', textAlign: 'center' }}>
                <p>No dashboard analysis is available for this course.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <section className="dashboard-empty">
          <p className="dashboard-empty__eyebrow">Instructor Control Empty</p>
          <h2 className="dashboard-empty__title">You have not created any courses.</h2>
          <p className="dashboard-empty__text">
            Author a course, create modules, and set quizzes. Once learners register and enroll, their metrics, scores, and activity streams will compile here.
          </p>
        </section>
      )}
    </div>
  );
};
