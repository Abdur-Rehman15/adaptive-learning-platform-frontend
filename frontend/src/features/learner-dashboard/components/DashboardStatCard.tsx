import type { CSSProperties, ReactNode } from 'react';

interface DashboardStatCardProps {
  label: string;
  value: string;
  meta?: string;
  icon?: ReactNode;
  accentColor?: string;
  trend?: {
    direction: 'up' | 'down';
    label: string;
  };
}

export const DashboardStatCard = ({
  label,
  value,
  meta,
  icon,
  accentColor = 'var(--learner-blue)',
  trend,
}: DashboardStatCardProps) => (
  <article
    className="learner-stat-card"
    style={{ '--learner-stat-accent': accentColor } as CSSProperties}
  >
    <span className="learner-stat-card__stripe" aria-hidden="true" />
    <div className="learner-stat-card__body">
      {icon ? <span className="learner-stat-card__icon">{icon}</span> : null}
      <p className="learner-stat-card__label">{label}</p>
      <p className="learner-stat-card__value">{value}</p>
      {meta ? <p className="learner-stat-card__meta">{meta}</p> : null}
      {trend ? (
        <p
          className={`learner-stat-card__trend learner-stat-card__trend--${trend.direction}`}
        >
          {trend.direction === 'up' ? '↑' : '↓'} {trend.label}
        </p>
      ) : null}
    </div>
  </article>
);

export default DashboardStatCard;
