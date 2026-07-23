import { useNavigate } from 'react-router-dom';

const EmptyIllustration = () => (
  <svg
    className="learner-empty__illustration"
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    aria-hidden="true"
  >
    <rect x="8" y="16" width="48" height="56" rx="6" stroke="currentColor" strokeWidth="2.5" />
    <path
      d="M20 32h24M20 42h18M20 52h22"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="58" cy="52" r="16" stroke="currentColor" strokeWidth="2.5" />
    <path
      d="M52 52l4 4 8-8"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DashboardEmptyState = () => {
  const navigate = useNavigate();

  return (
    <section className="learner-empty">
      <EmptyIllustration />
      <p className="learner-empty__eyebrow">Your learning journey starts here</p>
      <h2 className="learner-empty__title">No courses enrolled yet</h2>
      <p className="learner-empty__text">
        Browse the catalog and enroll in a course to track your progress, quiz scores,
        and earn certificates — everything will show up right here.
      </p>
      <button
        onClick={() => navigate('/courses')}
        className="dashboard-btn dashboard-btn--primary learner-empty__cta"
        type="button"
      >
        Browse &amp; Enroll in Courses
      </button>
    </section>
  );
};
