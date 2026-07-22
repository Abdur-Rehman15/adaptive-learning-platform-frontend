import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/features/auth/context/AuthContext';
import { CourseSelector } from '@/features/dashboard/components/CourseSelector';
import { DashboardEmptyState } from '@/features/dashboard/components/DashboardEmptyState';
import { DashboardStatCard } from '@/features/dashboard/components/DashboardStatCard';
import { ScoreTrendList } from '@/features/dashboard/components/ScoreTrendList';
import { useLearnerDashboard } from '@/features/dashboard/hooks/useLearnerDashboard';

export const Dashboard = () => {
  const { user, isHydrating } = useAuth();
  const {
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
    summaryError,
    trendsError,
  } = useLearnerDashboard();

  const role = user?.role ?? 'user';
  const isInitialLoading = isHydrating || isLoadingEnrollments;

  if (isInitialLoading) {
    return (
      <div className="app-shell">
        <Navbar role={role} />
        <main className="app-shell__content">
          <section className="dashboard-loading">Loading your dashboard…</section>
        </main>
        <Footer role={role} />
      </div>
    );
  }

  const summaryMetrics = summary
    ? [
        {
          label: 'Progress',
          value: `${summary.progressPercent}%`,
          meta: `${summary.completedModules}/${summary.totalModules || 0} modules`,
        },
        {
          label: 'Average score',
          value: `${summary.averageScore}%`,
          meta: `${summary.completedQuizzes}/${summary.totalQuizzes || 0} quizzes`,
        },
        {
          label: 'Certificate',
          value: summary.certificateReady ? 'Ready' : 'Pending',
          meta: summary.certificateReady ? 'Available for download' : 'Complete the course to unlock it',
        },
      ]
    : [];

  return (
    <div className="app-shell">
      <Navbar role={role} />
      <main className="app-shell__content">
        <section className="dashboard-hero">
          <div>
            <p className="dashboard-hero__eyebrow">Learner dashboard</p>
            <h1 className="dashboard-hero__title">
              Welcome back, {user?.username ?? 'learner'}.
            </h1>
            <p className="dashboard-hero__subtitle">
              Track your enrolled courses, progress, and performance for the selected course.
            </p>
          </div>

          <div className="dashboard-hero__badge">{role === 'admin' ? 'Instructor' : 'Learner'}</div>
        </section>

        {enrollmentsError || summaryError || trendsError ? (
          <section className="dashboard-error">
            We could not load all dashboard data right now. Please refresh and try again.
          </section>
        ) : null}

        {enrollments.length === 0 ? (
          <DashboardEmptyState />
        ) : (
          <>
            <section className="dashboard-grid dashboard-grid--stats">
              <DashboardStatCard
                label="Enrolled courses"
                value={String(dashboardStats.enrolledCourses)}
                meta="Total active registrations"
              />
              <DashboardStatCard
                label="Active courses"
                value={String(dashboardStats.activeCourses)}
                meta="Currently in progress"
              />
              <DashboardStatCard
                label="Completed courses"
                value={String(dashboardStats.completedCourses)}
                meta="Finished learning paths"
              />
              <DashboardStatCard
                label="Average progress"
                value={`${dashboardStats.averageProgress}%`}
                meta="Across all enrollments"
              />
            </section>

            <div className="dashboard-layout">
              <section className="dashboard-panel dashboard-panel--summary">
                <div className="dashboard-panel__header">
                  <div>
                    <p className="dashboard-panel__eyebrow">Selected course</p>
                    <h2 className="dashboard-panel__title">
                      {summary?.courseTitle ?? selectedEnrollment?.courseTitle ?? 'Course overview'}
                    </h2>
                  </div>
                  <p className="dashboard-panel__description">
                    {summary?.courseId ?? selectedEnrollment?.courseId ?? 'No course selected yet'}
                  </p>
                </div>

                <div className="dashboard-summary__progress">
                  <div className="dashboard-summary__progress-headline">
                    <span>Progress</span>
                    <span>{summary?.progressPercent ?? selectedEnrollment?.progressPercent ?? 0}%</span>
                  </div>
                  <div className="dashboard-progress dashboard-progress--large">
                    <div
                      className="dashboard-progress__fill"
                      style={{ width: `${summary?.progressPercent ?? selectedEnrollment?.progressPercent ?? 0}%` }}
                    />
                  </div>
                </div>

                <div className="dashboard-grid dashboard-grid--summary">
                  {summaryMetrics.map((metric) => (
                    <DashboardStatCard
                      key={metric.label}
                      label={metric.label}
                      value={metric.value}
                      meta={metric.meta}
                    />
                  ))}
                </div>
              </section>

              <ScoreTrendList trends={scoreTrends} />
            </div>

            <CourseSelector
              enrollments={enrollments}
              selectedCourseId={selectedCourseId}
              onSelectCourse={setSelectedCourseId}
            />

            {isLoadingSummary || isLoadingTrends ? (
              <section className="dashboard-loading dashboard-loading--inline">
                Updating selected course metrics…
              </section>
            ) : null}
          </>
        )}
      </main>
      <Footer role={role} />
    </div>
  );
};