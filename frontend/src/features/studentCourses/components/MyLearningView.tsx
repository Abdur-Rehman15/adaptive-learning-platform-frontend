import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useStudentCourses } from '../hooks/useStudentCourses';
import { DashboardStatCard } from '@/features/learner-dashboard/components/DashboardStatCard';
import { MyLearningCourseList } from './MyLearningCourseList';
import { MyLearningCourseDetail } from './MyLearningCourseDetail';

/* ── Icons ────────────────────────────────────────────────────── */

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
    <path
      d="M3 14l4-4 4 3 6-7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 6h3v3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconGradCap = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path
      d="M2 10l12-6 12 6-12 6-12-6z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
    <path
      d="M24 10v8M8 14v6a4 4 0 008 0v-6"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
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

const MyLearningLoading = ({ message }: { message: string }) => (
  <div className="ml-loading">
    <div className="ml-loading__spinner" role="status" aria-label="Loading" />
    <p className="ml-loading__text">{message}</p>
  </div>
);

const getInitials = (name?: string | null): string => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

type FilterTab = 'all' | 'active' | 'completed';

export const MyLearningView = () => {
  const { user } = useAuth();
  const { courses, isLoading, error } = useStudentCourses();
  const navigate = useNavigate();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterTab>('all');

  const enrolledCourses = useMemo(
    () => courses.filter((course) => course.isEnrolled),
    [courses]
  );

  const filteredCourses = useMemo(() => {
    if (filter === 'active') {
      return enrolledCourses.filter((c) => (c.progressPercent ?? 0) < 100);
    }
    if (filter === 'completed') {
      return enrolledCourses.filter((c) => (c.progressPercent ?? 0) === 100);
    }
    return enrolledCourses;
  }, [enrolledCourses, filter]);

  const stats = useMemo(() => {
    const count = enrolledCourses.length;
    const avgProgress = count
      ? Math.round(
          enrolledCourses.reduce((sum, c) => sum + (c.progressPercent ?? 0), 0) / count
        )
      : 0;
    const completed = enrolledCourses.filter((c) => (c.progressPercent ?? 0) === 100).length;
    const inProgress = count - completed;
    return { count, avgProgress, completed, inProgress };
  }, [enrolledCourses]);

  const selectedCourse = useMemo(
    () => enrolledCourses.find((c) => c.id === selectedCourseId) ?? null,
    [enrolledCourses, selectedCourseId]
  );

  useEffect(() => {
    if (!filteredCourses.length) {
      setSelectedCourseId(null);
      return;
    }

    const stillVisible = selectedCourseId
      ? filteredCourses.some((c) => c.id === selectedCourseId)
      : false;

    if (!stillVisible) {
      setSelectedCourseId(filteredCourses[0].id);
    }
  }, [filteredCourses, selectedCourseId]);

  if (isLoading) {
    return <MyLearningLoading message="Syncing your learning workspace…" />;
  }

  if (error) {
    return (
      <div className="ml-error">
        <IconWarning />
        <p className="ml-error__text">Error loading enrollments: {error.message}</p>
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
    <div className="my-learning-page">
      {/* Hero */}
      <section className="ml-hero">
        <div className="ml-hero__inner">
          <div className="ml-hero__identity">
            <div className="ml-hero__avatar" aria-hidden="true">
              {getInitials(user?.username)}
            </div>
            <div>
              <p className="ml-hero__eyebrow">My Learning Workspace</p>
              <h1 className="ml-hero__title">
                {user?.username ? `${user.username}'s Tracks` : 'My Learning'}
              </h1>
              <p className="ml-hero__subtitle">
                Study modules, attempt quizzes, and earn certificates across your enrolled courses.
              </p>
            </div>
          </div>
          <div className="ml-hero__actions">
            {enrolledCourses.length > 0 && (
              <div className="ml-hero__badge">
                <IconGradCap />
                <span>
                  {stats.inProgress} in progress · {stats.completed} completed
                </span>
              </div>
            )}
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



      {/* Main content */}
      {enrolledCourses.length > 0 ? (
        <div className="ml-layout">
          <MyLearningCourseList
            courses={filteredCourses}
            selectedCourseId={selectedCourseId}
            filter={filter}
            onFilterChange={setFilter}
            onSelectCourse={setSelectedCourseId}
          />

          {selectedCourse ? (
            <MyLearningCourseDetail course={selectedCourse} />
          ) : (
            <div className="dashboard-panel ml-empty-detail">
              <p className="dashboard-panel__empty">
                No courses match this filter. Try a different tab.
              </p>
            </div>
          )}
        </div>
      ) : (
        <section className="dashboard-empty ml-empty-state">
          <div className="ml-empty-state__icon" aria-hidden="true">
            <IconBooks />
          </div>
          <p className="dashboard-empty__eyebrow">No Enrolled Tracks</p>
          <h2 className="dashboard-empty__title">Your learning workspace is empty</h2>
          <p className="dashboard-empty__text">
            Explore the course catalog to enroll. Once enrolled, your modules, quizzes, and
            certificates will appear here.
          </p>
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="dashboard-btn dashboard-btn--accent"
          >
            Browse Courses
          </button>
        </section>
      )}
    </div>
  );
};
