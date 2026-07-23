import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { AdminCourseSelector } from './AdminCourseSelector';
import { ModuleMetricsList } from './ModuleMetricsList';
import { LearnerProgressTable } from './LearnerProgressTable';
import { AdminStatCard } from './AdminStatCard';

/* ── Inline SVG icons ─────────────────────────────────────────── */

const IconBooks = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 4h5v12H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 4h5v12H8V4z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M13 4h4a1 1 0 011 1v10a1 1 0 01-1 1h-4V4z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 17c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="14" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14 12c2.5 0 4 1.2 4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconChart = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 17V3M3 17h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="6" y="10" width="3" height="7" rx="1" fill="currentColor" opacity="0.85" />
    <rect x="11" y="6" width="3" height="11" rx="1" fill="currentColor" opacity="0.85" />
    <rect x="16" y="8" width="3" height="9" rx="1" fill="currentColor" opacity="0.85" />
  </svg>
);

const IconTrophy = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M6 3h8v3a4 4 0 01-8 0V3z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 3H2v2a2 2 0 002 2M16 3h2v2a2 2 0 01-2 2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 10v3M7 17h6M8 13h4v4H8v-4z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconPulse = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M1 8h3l2-5 3 10 2-5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconWarning = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2L1 14h14L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 7v3M8 12h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const AdminLoading = ({ message }: { message: string }) => (
  <div className="admin-loading">
    <div className="admin-loading__spinner" role="status" aria-label="Loading" />
    <p className="admin-loading__text">{message}</p>
  </div>
);

const ProgressRing = ({
  percent,
  color = 'var(--admin-indigo)',
  label,
}: {
  percent: number;
  color?: string;
  label: string;
}) => {
  const size = 120;
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="admin-metric-ring">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="admin-metric-ring__arc"
        />
      </svg>
      <div className="admin-metric-ring__center">
        <span className="admin-metric-ring__value" style={{ color }}>{clamped}%</span>
        <span className="admin-metric-ring__label">{label}</span>
      </div>
    </div>
  );
};

const getInitials = (name?: string | null): string => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

export const AdminDashboardView = () => {
  const {
    user,
    courses,
    selectedCourseId,
    setSelectedCourseId,
    dashboardStats,
    dashboardData,
    isLoadingCourses,
    isLoadingDashboard,
    coursesError,
  } = useAdminDashboard();

  const navigate = useNavigate();

  if (isLoadingCourses) {
    return <AdminLoading message="Syncing instructor workspace…" />;
  }

  if (coursesError) {
    return (
      <div className="admin-error">
        <IconWarning />
        <p className="admin-error__text">
          Error loading instructor courses: {coursesError.message}
        </p>
        <button
          type="button"
          className="dashboard-btn dashboard-btn--primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Hero */}
      <section className="admin-hero">
        <div className="admin-hero__inner">
          <div className="admin-hero__identity">
            <div className="admin-hero__avatar" aria-hidden="true">
              {getInitials(user?.username)}
            </div>
            <div>
              <p className="admin-hero__eyebrow">Instructor Console</p>
              <h1 className="admin-hero__title">
                Welcome back, {user?.username ?? 'Instructor'}
              </h1>
              <p className="admin-hero__subtitle">
                Monitor cohort performance, module metrics, and learner grades across your courses.
              </p>
            </div>
          </div>
          <div className="admin-hero__actions">
            {courses.length > 0 && (
              <div className="admin-hero__badge">
                <IconPulse />
                <span>
                  {dashboardStats.activeLearners} active learner
                  {dashboardStats.activeLearners !== 1 ? 's' : ''} this week
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => navigate('/courses/create')}
              className="dashboard-btn dashboard-btn--accent"
            >
              + New Course
            </button>
            <button
              type="button"
              onClick={() => navigate('/courses')}
              className="dashboard-btn dashboard-btn--primary"
            >
              Manage Courses
            </button>
          </div>
        </div>
      </section>

      {/* Global stat cards */}
      {courses.length > 0 && (
        <div className="admin-stat-row">
          <AdminStatCard
            label="Courses Managed"
            value={String(dashboardStats.coursesManaged)}
            meta="Active curriculum tracks"
            icon={<IconBooks />}
            accentColor="var(--admin-indigo)"
          />
          <AdminStatCard
            label="Total Learners"
            value={String(dashboardStats.totalLearners)}
            meta="Enrolled across all courses"
            icon={<IconUsers />}
            accentColor="var(--admin-teal)"
          />
          <AdminStatCard
            label="Cohort Avg Score"
            value={`${dashboardStats.averageScore}%`}
            meta="Quiz performance index"
            icon={<IconChart />}
            accentColor="var(--admin-amber)"
          />
          <AdminStatCard
            label="Completions"
            value={String(dashboardStats.completedLearners)}
            meta="Certificates issued"
            icon={<IconTrophy />}
            accentColor="var(--admin-rose)"
          />
        </div>
      )}

      {/* Analytics */}
      {courses.length > 0 ? (
        <div className="admin-dashboard-layout">
          <AdminCourseSelector
            courses={courses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={setSelectedCourseId}
          />

          <div className="admin-detail-column">
            {isLoadingDashboard ? (
              <div className="dashboard-panel admin-panel-loading">
                <AdminLoading message="Syncing course analytics…" />
              </div>
            ) : dashboardData ? (
              <>
                <section className="dashboard-panel admin-summary-panel">
                  <div className="dashboard-panel__header">
                    <div>
                      <p className="dashboard-panel__eyebrow admin-eyebrow">Focus Overview</p>
                      <h2 className="dashboard-panel__title">{dashboardData.summary.courseTitle}</h2>
                    </div>
                    <p className="dashboard-panel__description">
                      {dashboardData.summary.totalLearners} enrolled ·{' '}
                      {dashboardData.summary.certificatesIssued} certificates issued
                    </p>
                  </div>

                  <div className="admin-metrics-grid">
                    <div className="admin-metric-card">
                      <ProgressRing
                        percent={dashboardData.summary.averageProgress}
                        color="var(--admin-indigo)"
                        label="Avg Progress"
                      />
                    </div>
                    <div className="admin-metric-card">
                      <ProgressRing
                        percent={dashboardData.summary.completionRate}
                        color="var(--admin-teal)"
                        label="Completion"
                      />
                    </div>
                    <div className="admin-metric-card">
                      <ProgressRing
                        percent={dashboardData.summary.averageScore}
                        color="var(--admin-rose)"
                        label="Avg Grade"
                      />
                    </div>
                  </div>

                  <div className="admin-mini-stats">
                    <div className="admin-mini-stat">
                      <span className="admin-mini-stat__value">{dashboardData.summary.activeLearners}</span>
                      <span className="admin-mini-stat__label">Active</span>
                    </div>
                    <div className="admin-mini-stat">
                      <span className="admin-mini-stat__value">{dashboardData.summary.completedLearners}</span>
                      <span className="admin-mini-stat__label">Completed</span>
                    </div>
                    <div className="admin-mini-stat">
                      <span className="admin-mini-stat__value">{dashboardData.modules.length}</span>
                      <span className="admin-mini-stat__label">Modules</span>
                    </div>
                  </div>
                </section>

                <ModuleMetricsList modules={dashboardData.modules} />
                <LearnerProgressTable learners={dashboardData.topLearners} />

                {dashboardData.recentActivity.length > 0 && (
                  <section className="dashboard-panel admin-activity-panel">
                    <div className="dashboard-panel__header">
                      <div>
                        <p className="dashboard-panel__eyebrow admin-eyebrow">Live Feed</p>
                        <h2 className="dashboard-panel__title">Course Activity Stream</h2>
                      </div>
                      <p className="dashboard-panel__description">
                        Latest completions and quiz submissions.
                      </p>
                    </div>

                    <div className="admin-activity-timeline">
                      {dashboardData.recentActivity.map((activity, idx) => (
                        <div key={idx} className="admin-activity-timeline__item">
                          <div
                            className="admin-activity-timeline__marker"
                            data-variant={idx % 3}
                            aria-hidden="true"
                          />
                          <div className="admin-activity-timeline__content">
                            <span className="admin-activity-timeline__index">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span className="admin-activity-timeline__text">{activity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : (
              <div className="dashboard-panel admin-empty-panel">
                <p className="dashboard-panel__empty">
                  No dashboard analytics available for this course yet.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <section className="dashboard-empty admin-empty-state">
          <div className="admin-empty-state__icon" aria-hidden="true">
            <IconBooks />
          </div>
          <p className="dashboard-empty__eyebrow">Instructor Control Empty</p>
          <h2 className="dashboard-empty__title">You have not created any courses yet.</h2>
          <p className="dashboard-empty__text">
            Author a course, create modules, and set quizzes. Once learners register and enroll,
            their metrics, scores, and activity streams will compile here.
          </p>
          <button
            type="button"
            onClick={() => navigate('/courses/create')}
            className="dashboard-btn dashboard-btn--accent"
          >
            + Create Your First Course
          </button>
        </section>
      )}
    </div>
  );
};
