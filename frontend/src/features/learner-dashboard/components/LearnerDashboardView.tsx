import { useLearnerDashboard } from '../hooks/useLearnerDashboard';
import { CourseSelector } from './CourseSelector';
import { ScoreTrendList } from './ScoreTrendList';
import { DashboardStatCard } from './DashboardStatCard';
import { DashboardEmptyState } from './DashboardEmptyState';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LearnerDashboardView = () => {
  const {
    user,
    enrollments,
    selectedCourseId,
    setSelectedCourseId,
    selectedEnrollment,
    dashboardStats,
    summary,
    scoreTrends,
    isLoadingEnrollments,
    isLoadingSummary,
    isLoadingTrends,
    enrollmentsError,
  } = useLearnerDashboard();

  const { clearSession } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  if (isLoadingEnrollments) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem' }}>SYNCING DASHBOARD STATE…</p>
      </div>
    );
  }

  if (enrollmentsError) {
    return (
      <div className="auth-card" style={{ margin: '48px auto', textAlign: 'center' }}>
        <p className="auth-card__error">Error loading dashboard: {enrollmentsError.message}</p>
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
          Learning Workspace
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
              Welcome back, {user?.username}
            </h1>
            <p style={{ color: 'var(--color-ink-soft)', margin: 0 }}>
              Your course path, quiz scores, and certificate dashboard are fully loaded.
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="dashboard-btn dashboard-btn--primary"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Stats Readout Header */}
      {enrollments.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <DashboardStatCard
            label="Enrolled Courses"
            value={String(dashboardStats.enrolledCourses)}
            meta="Total active course allocations"
          />
          <DashboardStatCard
            label="In Progress"
            value={String(dashboardStats.activeCourses)}
            meta="Courses actively pursued"
          />
          <DashboardStatCard
            label="Certificates Earned"
            value={String(dashboardStats.completedCourses)}
            meta="Verified platform completions"
          />
          <DashboardStatCard
            label="Average Completion"
            value={`${dashboardStats.averageProgress}%`}
            meta="Progress across all tracks"
          />
        </div>
      )}

      {/* Main Course Content Section */}
      {enrollments.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', alignItems: 'start' }} className="responsive-dashboard-grid">
          {/* Left Side Course Selector */}
          <CourseSelector
            enrollments={enrollments}
            selectedCourseId={selectedCourseId}
            onSelectCourse={setSelectedCourseId}
          />

          {/* Right Side Selected Course Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {isLoadingSummary ? (
              <div className="dashboard-panel" style={{ padding: '48px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem' }}>SYNCING COURSE SUMMARY…</p>
              </div>
            ) : summary ? (
              <section className="dashboard-panel">
                <div className="dashboard-panel__header">
                  <div>
                    <p className="dashboard-panel__eyebrow">Course metrics</p>
                    <h2 className="dashboard-panel__title">{summary.courseTitle} Overview</h2>
                  </div>
                  <p className="dashboard-panel__description">
                    Progress summary and certificates for course ID: {summary.courseId}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '24px' }}>
                  <div style={{ border: '2px solid var(--color-border)', borderRadius: '8px', padding: '16px', background: 'var(--color-surface-sunken)' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-ink-soft)', marginBottom: '8px' }}>
                      Modules study progress
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                      {summary.completedModules} <span style={{ fontSize: '1rem', color: 'var(--color-ink-soft)' }}>/ {summary.totalModules} completed</span>
                    </p>
                  </div>

                  <div style={{ border: '2px solid var(--color-border)', borderRadius: '8px', padding: '16px', background: 'var(--color-surface-sunken)' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-ink-soft)', marginBottom: '8px' }}>
                      Quizzes Taken
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                      {summary.completedQuizzes} <span style={{ fontSize: '1rem', color: 'var(--color-ink-soft)' }}>/ {summary.totalQuizzes} taken</span>
                    </p>
                  </div>

                  <div style={{ border: '2px solid var(--color-border)', borderRadius: '8px', padding: '16px', background: 'var(--color-surface-sunken)' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-ink-soft)', marginBottom: '8px' }}>
                      Average Quiz Score
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                      {summary.averageScore}%
                    </p>
                  </div>
                </div>

                {summary.certificateReady && (
                  <div 
                    style={{ 
                      marginTop: '24px',
                      border: '2px dashed var(--color-success)', 
                      borderRadius: '8px', 
                      padding: '16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      background: 'rgba(22, 163, 74, 0.05)'
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0, color: 'var(--color-success)', fontWeight: 700 }}>Certificate Ready!</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-ink-soft)' }}>
                        You completed all modules. Download your PDF certification.
                      </p>
                    </div>
                    <button 
                      onClick={() => alert('Certificate download API would trigger here.')}
                      className="dashboard-btn" 
                      style={{ borderColor: 'var(--color-success)', color: 'var(--color-success)' }}
                    >
                      Download
                    </button>
                  </div>
                )}
              </section>
            ) : null}

            {isLoadingTrends ? (
              <div className="dashboard-panel" style={{ padding: '48px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem' }}>SYNCING PERFORMANCE TRENDS…</p>
              </div>
            ) : (
              <ScoreTrendList trends={scoreTrends} />
            )}
          </div>
        </div>
      ) : (
        <DashboardEmptyState />
      )}
    </div>
  );
};
