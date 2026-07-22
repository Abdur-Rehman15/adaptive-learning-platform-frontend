import type { InstructorLearnerMetric } from '../types/adminDashboard.types';

interface LearnerProgressTableProps {
  learners: InstructorLearnerMetric[];
}

export const LearnerProgressTable = ({ learners }: LearnerProgressTableProps) => {
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="dashboard-panel__eyebrow" style={{ color: 'var(--color-accent)' }}>Roster</p>
          <h2 className="dashboard-panel__title">Learner Progress</h2>
        </div>
        <p className="dashboard-panel__description">
          Detailed metrics of students enrolled in this course.
        </p>
      </div>

      {learners.length > 0 ? (
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table 
            style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              textAlign: 'left',
              border: '2px solid var(--color-border)'
            }}
          >
            <thead>
              <tr style={{ background: 'var(--color-surface-sunken)', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '12px', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Learner</th>
                <th style={{ padding: '12px', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Progress</th>
                <th style={{ padding: '12px', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Average Score</th>
                <th style={{ padding: '12px', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {learners.map((learner) => (
                <tr 
                  key={learner.id} 
                  style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
                >
                  <td style={{ padding: '12px', fontWeight: 600 }}>{learner.name}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="dashboard-progress dashboard-progress--soft" style={{ width: '80px', height: '6px' }}>
                        <div 
                          className="dashboard-progress__fill" 
                          style={{ width: `${learner.progressPercent}%`, background: 'var(--color-accent)' }}
                        />
                      </div>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
                        {learner.progressPercent}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                    {learner.score}%
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span 
                      style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        background: learner.status.toLowerCase().includes('complete') ? 'rgba(22, 163, 74, 0.1)' : 'var(--color-surface-sunken)',
                        color: learner.status.toLowerCase().includes('complete') ? 'var(--color-success)' : 'var(--color-ink-soft)'
                      }}
                    >
                      {learner.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="dashboard-panel__empty">No learners enrolled in this course.</p>
      )}
    </section>
  );
};
