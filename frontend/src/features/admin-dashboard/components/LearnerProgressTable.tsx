import type { InstructorLearnerMetric } from '../types/adminDashboard.types';

interface LearnerProgressTableProps {
  learners: InstructorLearnerMetric[];
}

type StatusVariant = 'completed' | 'in-progress' | 'inactive';

function getStatusVariant(status: string): StatusVariant {
  const lower = status.toLowerCase();
  if (lower.includes('complete')) return 'completed';
  if (lower.includes('progress') || lower.includes('active')) return 'in-progress';
  return 'inactive';
}

function getScoreClass(score: number): string {
  if (score >= 80) return 'admin-table-score--high';
  if (score >= 50) return 'admin-table-score--mid';
  return 'admin-table-score--low';
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getRankClass(rank: number): string {
  if (rank === 1) return 'admin-rank--gold';
  if (rank === 2) return 'admin-rank--silver';
  if (rank === 3) return 'admin-rank--bronze';
  return '';
}

export const LearnerProgressTable = ({ learners }: LearnerProgressTableProps) => {
  return (
    <section className="dashboard-panel admin-roster-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="dashboard-panel__eyebrow admin-eyebrow">Roster</p>
          <h2 className="dashboard-panel__title">Top Learners</h2>
        </div>
        <p className="dashboard-panel__description">
          Ranked by progress and quiz performance.
        </p>
      </div>

      {learners.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Learner</th>
                <th>Progress</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {learners.map((learner, index) => {
                const variant = getStatusVariant(learner.status);
                const rank = index + 1;

                return (
                  <tr key={learner.id} className="admin-table-row">
                    <td>
                      <span className={`admin-rank ${getRankClass(rank)}`}>
                        {rank}
                      </span>
                    </td>
                    <td>
                      <div className="admin-learner-cell">
                        <span className="admin-learner-cell__avatar" aria-hidden="true">
                          {getInitials(learner.name)}
                        </span>
                        <span className="admin-learner-cell__name">{learner.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-progress-cell">
                        <div className="admin-progress-bar">
                          <div
                            className="admin-progress-bar__fill"
                            style={{ width: `${learner.progressPercent}%` }}
                          />
                        </div>
                        <span className="admin-progress-cell__value">
                          {learner.progressPercent}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`admin-table-score ${getScoreClass(learner.score)}`}>
                        {learner.score}%
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status-chip admin-status-chip--${variant}`}>
                        {learner.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="dashboard-panel__empty">No learners enrolled in this course.</p>
      )}
    </section>
  );
};
