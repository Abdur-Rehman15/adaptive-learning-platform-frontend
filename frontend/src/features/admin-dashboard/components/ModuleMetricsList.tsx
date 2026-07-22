import type { InstructorModuleMetric } from '../types/adminDashboard.types';

interface ModuleMetricsListProps {
  modules: InstructorModuleMetric[];
}

export const ModuleMetricsList = ({ modules }: ModuleMetricsListProps) => {
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="dashboard-panel__eyebrow" style={{ color: 'var(--color-accent)' }}>Structure</p>
          <h2 className="dashboard-panel__title">Active Module Performance</h2>
        </div>
        <p className="dashboard-panel__description">
          Learner statistics and scores per module.
        </p>
      </div>

      {modules.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
          {modules.map((mod) => (
            <div 
              key={mod.id} 
              style={{
                border: '2px solid var(--color-border)',
                borderRadius: '8px',
                padding: '16px',
                background: 'var(--color-surface-sunken)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{mod.title}</span>
                <span 
                  style={{ 
                    fontFamily: 'JetBrains Mono, monospace', 
                    fontSize: '0.75rem', 
                    color: 'var(--color-ink-soft)' 
                  }}
                >
                  {mod.learners} learners
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '4px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: '4px' }}>
                    <span>Completion Rate</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{mod.completionRate}%</span>
                  </div>
                  <div className="dashboard-progress dashboard-progress--soft" style={{ height: '8px' }}>
                    <div
                      className="dashboard-progress__fill"
                      style={{ width: `${mod.completionRate}%`, background: 'var(--color-accent)' }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-ink-soft)', marginBottom: '4px' }}>
                    <span>Average Score</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{mod.averageScore}%</span>
                  </div>
                  <div className="dashboard-progress dashboard-progress--soft" style={{ height: '8px' }}>
                    <div
                      className="dashboard-progress__fill"
                      style={{ width: `${mod.averageScore}%`, background: 'var(--color-success)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="dashboard-panel__empty">No modules found for this course.</p>
      )}
    </section>
  );
};
