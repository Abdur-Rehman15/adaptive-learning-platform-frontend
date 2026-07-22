import { useNavigate } from 'react-router-dom';

export const DashboardEmptyState = () => {
  const navigate = useNavigate();

  return (
    <section className="dashboard-empty">
      <p className="dashboard-empty__eyebrow">Nothing to show yet</p>
      <h2 className="dashboard-empty__title">You are not enrolled in any courses.</h2>
      <p className="dashboard-empty__text">
        Once a course is assigned or enrolled, your progress, quiz scores, and completion summary will appear here.
      </p>
      <button 
        onClick={() => navigate('/courses')}
        className="dashboard-btn dashboard-btn--primary"
        style={{ marginTop: '16px' }}
      >
        Browse & Enroll in Courses
      </button>
    </section>
  );
};
