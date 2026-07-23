import { useNavigate } from 'react-router-dom';
import { useLearnerDashboard } from '../hooks/useLearnerDashboard';
import { CourseSelector } from './CourseSelector';
import { ScoreTrendList } from './ScoreTrendList';
import { DashboardStatCard } from './DashboardStatCard';
import { DashboardEmptyState } from './DashboardEmptyState';

/* ── Inline SVG icons (no emoji) ─────────────────────────────── */

const IconBooks = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 4h5v12H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 4h5v12H8V4z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M13 4h4a1 1 0 011 1v10a1 1 0 01-1 1h-4V4z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconBolt = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M11 2L4 11h5l-1 7 7-9h-5l1-7z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const IconTrophy = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M6 3h8v3a4 4 0 01-8 0V3z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 3H2v2a2 2 0 002 2M16 3h2v2a2 2 0 01-2 2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 10v3M7 17h6M8 13h4v4H8v-4z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconTrend = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 14l4-4 4 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 6h3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconWarning = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 2L1 14h14L8 2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M8 7v3M8 12h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconGradCap = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M2 10l12-6 12 6-12 6-12-6z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M24 10v8M8 14v6a4 4 0 008 0v-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

/* ── Loading skeleton ─────────────────────────────────────────── */

const DashboardLoading = ({ message }: { message: string }) => (
  <div className="learner-loading">
    <div className="learner-loading__spinner" role="status" aria-label="Loading" />
    <p className="learner-loading__text">{message}</p>
  </div>
);

/* ── Progress ring ────────────────────────────────────────────── */

/* ── Progress ring ────────────────────────────────────────────── */

const ProgressRing = ({
  percent,
  color = 'var(--learner-blue)',
  label = 'Progress',
}: {
  percent: number;
  color?: string;
  label?: string;
}) => {
  const size = 128;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  // Clamp percent between 0 and 100
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clampedPercent / 100) * circumference;

  return (
    <div className="learner-metric-ring">
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        style={{ display: 'block' }} // Prevents extra spacing
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        {/* Progress arc - ensure it stays within bounds */}
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
          className="learner-metric-ring__arc"
          style={{
            transition: 'stroke-dashoffset 0.3s ease',
          }}
        />
      </svg>
      <div className="learner-metric-ring__center">
        <span className="learner-metric-ring__value">{clampedPercent}%</span>
        <span className="learner-metric-ring__label">{label}</span>
      </div>
    </div>
  );
};

/* ── Score arc gauge ──────────────────────────────────────────── */

const scoreColor = (score: number) => {
  if (score >= 70) return 'var(--learner-green)';
  if (score >= 40) return 'var(--learner-amber)';
  return 'var(--learner-red)';
};

const ScoreGauge = ({ score }: { score: number }) => {
  const width = 140;
  const height = 84;
  const cx = width / 2;
  const cy = height - 6;
  const r = 58;
  const stroke = 10;

  const toPoint = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy - r * Math.sin(rad),
    };
  };

  const left = toPoint(180);
  const right = toPoint(0);
  const endDeg = 180 - (score / 100) * 180;
  const end = toPoint(endDeg);
  const color = scoreColor(score);

  const trackPath = `M ${left.x} ${left.y} A ${r} ${r} 0 0 0 ${right.x} ${right.y}`;
  const fillPath =
    score > 0
      ? `M ${left.x} ${left.y} A ${r} ${r} 0 0 0 ${end.x} ${end.y}`
      : '';

  return (
    <div className="learner-gauge">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
      >
        <path
          d={trackPath}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {fillPath ? (
          <path
            d={fillPath}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            className="learner-gauge__arc"
          />
        ) : null}
      </svg>
      <div className="learner-gauge__center">
        <span className="learner-gauge__value" style={{ color }}>
          {score}%
        </span>
        <span className="learner-gauge__label">Avg. Score</span>
      </div>
    </div>
  );
};

const FocusAreas = ({ topics }: { topics: string[] }) => (
  <div className="learner-focus">
    <div className="learner-focus__header">
      <div>
        <p className="learner-focus__eyebrow">Performance insight</p>
        <h3 className="learner-focus__title">Improvement Areas</h3>
      </div>
      <span className="learner-focus__count">
        {topics.length} topic{topics.length !== 1 ? 's' : ''}
      </span>
    </div>
    <div className="learner-focus__grid">
      {topics.map((topic, index) => {
        const intensity = Math.max(35, 100 - index * 18);
        const rank = index + 1;

        return (
          <article key={topic} className="learner-focus-card">
            <div className="learner-focus-card__header">
              <span className="learner-focus-card__badge">
                ⚠️ Priority {rank}
              </span>
            </div>
            <div className="learner-focus-card__topic-wrapper">
              <p className="learner-focus-card__topic">{topic}</p>
            </div>
            <div className="learner-focus-card__body">
              <div className="learner-focus-card__meta-line">
                <span>Recommended Action</span>
                <span className="learner-focus-card__percentage">{intensity}%</span>
              </div>
              <div className="learner-focus-card__meter" aria-hidden="true">
                <span
                  className="learner-focus-card__meter-fill"
                  style={{ width: `${intensity}%` }}
                />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  </div>
);


/* ── Avatar initials helper ───────────────────────────────────── */

const getInitials = (name?: string | null): string => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

/* ── Main view ────────────────────────────────────────────────── */

export const LearnerDashboardView = () => {
  const {
    user,
    enrollments,
    selectedCourseId,
    setSelectedCourseId,
    dashboardStats,
    summary,
    scoreTrends,
    isLoadingEnrollments,
    isLoadingSummary,
    isLoadingTrends,
    enrollmentsError,
  } = useLearnerDashboard();

  const navigate = useNavigate();

  if (isLoadingEnrollments) {
    return <DashboardLoading message="Syncing dashboard state…" />;
  }

  if (enrollmentsError) {
    return (
      <div className="learner-error">
        <IconWarning />
        <p className="learner-error__text">
          Error loading dashboard: {enrollmentsError.message}
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
    <div className="learner-dashboard">
      {/* Hero banner */}
      <section className="learner-dashboard-hero">
        <div className="learner-hero__inner">
          <div className="learner-hero__identity">
            <div className="learner-hero__avatar" aria-hidden="true">
              {getInitials(user?.username)}
            </div>
            <div>
              <p className="learner-hero__eyebrow">Learning Workspace</p>
              <h1 className="learner-hero__title">
                Welcome back, {user?.username ?? 'Learner'}
              </h1>
              <p className="learner-hero__subtitle">
                Your course path, quiz scores, and certificates — all in one place.
              </p>
            </div>
          </div>
          <div className="learner-hero__actions">
            <div className="learner-hero__badge">
              <IconGradCap />
              <span>
                {enrollments.length > 0
                  ? `${dashboardStats.activeCourses} course${dashboardStats.activeCourses !== 1 ? 's' : ''} in progress`
                  : 'Ready to start learning'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/courses')}
              className="dashboard-btn dashboard-btn--primary"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </section>

      {/* Stat cards */}
      {enrollments.length > 0 && (
        <div className="learner-stat-row">
          <DashboardStatCard
            label="Enrolled Courses"
            value={String(dashboardStats.enrolledCourses)}
            meta="Total active allocations"
            icon={<IconBooks />}
            accentColor="var(--learner-blue)"
          />
          <DashboardStatCard
            label="In Progress"
            value={String(dashboardStats.activeCourses)}
            meta="Actively pursued"
            icon={<IconBolt />}
            accentColor="var(--learner-blue)"
          />
          <DashboardStatCard
            label="Certificates Earned"
            value={String(dashboardStats.completedCourses)}
            meta="Verified completions"
            icon={<IconTrophy />}
            accentColor="var(--learner-green)"
          />
          <DashboardStatCard
            label="Average Completion"
            value={`${dashboardStats.averageProgress}%`}
            meta="Across all tracks"
            icon={<IconTrend />}
            accentColor="var(--learner-amber)"
          />
        </div>
      )}

      {/* Main content */}
      {enrollments.length > 0 ? (
        <div className="responsive-dashboard-grid">
          <CourseSelector
            enrollments={enrollments}
            selectedCourseId={selectedCourseId}
            onSelectCourse={setSelectedCourseId}
          />

          <div className="learner-detail-column">
            {isLoadingSummary ? (
              <div className="dashboard-panel learner-panel-loading">
                <DashboardLoading message="Syncing course summary…" />
              </div>
            ) : summary ? (
              <section className="dashboard-panel learner-summary-panel">
                <div className="dashboard-panel__header">
                  <div>
                    <p className="dashboard-panel__eyebrow">Course metrics</p>
                    <h2 className="dashboard-panel__title">{summary.courseTitle} Overview</h2>
                  </div>
                  <p className="dashboard-panel__description">
                    Your progress and performance for this course.
                  </p>
                </div>

                <div className="learner-metrics-grid">
                  <div className="learner-metric-card">
                    <ProgressRing percent={summary.progressPercent} label="Progress" color="var(--learner-blue)" />
                  </div>
                  <div className="learner-metric-card">
                    <ProgressRing percent={summary.averageScore} label="Avg. Score" color={scoreColor(summary.averageScore)} />
                  </div>
                </div>

                {summary.weakestTopics.length > 0 && (
                  <FocusAreas topics={summary.weakestTopics} />
                )}
              </section>
            ) : null}

            {isLoadingTrends ? (
              <div className="dashboard-panel learner-panel-loading">
                <DashboardLoading message="Syncing performance trends…" />
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
