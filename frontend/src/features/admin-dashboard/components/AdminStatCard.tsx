import type { CSSProperties, ReactNode } from 'react';

interface AdminStatCardProps {
  label: string;
  value: string;
  meta?: string;
  icon?: ReactNode;
  accentColor?: string;
}

export const AdminStatCard = ({
  label,
  value,
  meta,
  icon,
  accentColor = 'var(--admin-indigo)',
}: AdminStatCardProps) => (
  <article
    className="admin-stat-card"
    style={{ '--admin-stat-accent': accentColor } as CSSProperties}
  >
    <span className="admin-stat-card__stripe" aria-hidden="true" />
    <div className="admin-stat-card__body">
      {icon ? <span className="admin-stat-card__icon">{icon}</span> : null}
      <p className="admin-stat-card__label">{label}</p>
      <p className="admin-stat-card__value">{value}</p>
      {meta ? <p className="admin-stat-card__meta">{meta}</p> : null}
    </div>
  </article>
);
