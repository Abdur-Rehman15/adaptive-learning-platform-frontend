interface DashboardStatCardProps {
  label: string;
  value: string;
  meta?: string;
}

export const DashboardStatCard = ({ label, value, meta }: DashboardStatCardProps) => (
  <article className="dashboard-stat-card">
    <p className="dashboard-stat-card__label">{label}</p>
    <p className="dashboard-stat-card__value">{value}</p>
    {meta ? <p className="dashboard-stat-card__meta">{meta}</p> : null}
  </article>
);
