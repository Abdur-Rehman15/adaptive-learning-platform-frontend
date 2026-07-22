import type { LearnerScoreTrend } from '../types/dashboard.types';

interface ScoreTrendListProps {
  trends: LearnerScoreTrend[];
}

export const ScoreTrendList = ({ trends }: ScoreTrendListProps) => {
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="dashboard-panel__eyebrow">Performance</p>
          <h2 className="dashboard-panel__title">Score trend by module</h2>
        </div>
        <p className="dashboard-panel__description">
          Latest module scores for the selected course.
        </p>
      </div>

      {trends.length > 0 ? (
        <div className="dashboard-trend-list">
          {trends.map((trend) => (
            <div key={trend.label} className="dashboard-trend-item">
              <div className="dashboard-trend-item__meta">
                <span className="dashboard-trend-item__label">{trend.label}</span>
                <span className="dashboard-trend-item__score">{trend.score}%</span>
              </div>
              <div className="dashboard-progress dashboard-progress--soft">
                <div
                  className="dashboard-progress__fill dashboard-progress__fill--accent"
                  style={{ width: `${trend.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="dashboard-panel__empty">No trend data is available for this course yet.</p>
      )}
    </section>
  );
};