import { useState } from 'react';
import type { LearnerScoreTrend } from '../types/learnerDashboard.types';

interface ScoreTrendListProps {
  trends: LearnerScoreTrend[];
}

const barColor = (score: number): string => {
  if (score >= 80) return '#22d3a0';
  if (score >= 60) return '#f59e0b';
  return '#f87171';
};

const CHART_HEIGHT = 200;
const BAR_RADIUS   = 8;
const PADDING_LEFT  = 48;
const PADDING_RIGHT = 24;
const PADDING_TOP   = 28;
const PADDING_BOTTOM = 44; // room for "Module N" labels

export const ScoreTrendList = ({ trends }: ScoreTrendListProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (trends.length === 0) {
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
        <p className="dashboard-panel__empty">No trend data is available for this course yet.</p>
      </section>
    );
  }

  const n = trends.length;

  // Bar & gap sizing — wider bars for fewer modules
  const BAR_WIDTH = Math.max(36, Math.min(64, Math.floor(500 / n) - 14));
  const GAP       = Math.max(14, Math.min(28, Math.floor(500 / n) - BAR_WIDTH));

  // Total SVG width enough for all bars, centred inside the panel
  const innerWidth  = n * (BAR_WIDTH + GAP) - GAP;
  const svgWidth    = innerWidth + PADDING_LEFT + PADDING_RIGHT;
  const svgHeight   = CHART_HEIGHT + PADDING_TOP + PADDING_BOTTOM;

  const gridLines = [0, 25, 50, 75, 100];

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="dashboard-panel__eyebrow">Performance</p>
          <h2 className="dashboard-panel__title">Score trend by module</h2>
        </div>
        <p className="dashboard-panel__description">
          Latest quiz score per module — hover a bar to see the module name.
        </p>
      </div>

      {/* Scroll wrapper — centred */}
      <div
        style={{
          overflowX: 'auto',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{ display: 'block', fontFamily: 'Inter, sans-serif', overflow: 'visible' }}
          aria-label="Score trend by module bar chart"
          role="img"
        >
          {/* ── Y-axis grid lines ── */}
          {gridLines.map((pct) => {
            const y = PADDING_TOP + CHART_HEIGHT - (pct / 100) * CHART_HEIGHT;
            return (
              <g key={pct}>
                <line
                  x1={PADDING_LEFT}
                  x2={PADDING_LEFT + innerWidth}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={1}
                  strokeDasharray={pct === 0 ? 'none' : '4 4'}
                />
                <text
                  x={PADDING_LEFT - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={11}
                  fill="rgba(255,255,255,0.35)"
                  fontWeight={600}
                >
                  {pct}
                </text>
              </g>
            );
          })}

          {/* ── Bars ── */}
          {trends.map((trend, i) => {
            const barH   = Math.max(6, (trend.score / 100) * CHART_HEIGHT);
            const x      = PADDING_LEFT + i * (BAR_WIDTH + GAP);
            const y      = PADDING_TOP + CHART_HEIGHT - barH;
            const color  = barColor(trend.score);
            const isHovered = hoveredIndex === i;

            // Tooltip x position — clamp so it doesn't overflow left edge
            const tooltipW  = 160;
            const tooltipX  = Math.max(0, x + BAR_WIDTH / 2 - tooltipW / 2);
            const tooltipY  = Math.max(4, y - 52);

            return (
              <g
                key={trend.label}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Shadow glow bar */}
                <rect
                  x={x + 3}
                  y={y + 5}
                  width={BAR_WIDTH}
                  height={barH}
                  rx={BAR_RADIUS}
                  ry={BAR_RADIUS}
                  fill={color}
                  opacity={isHovered ? 0.28 : 0.15}
                />

                {/* Main bar */}
                <rect
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={barH}
                  rx={BAR_RADIUS}
                  ry={BAR_RADIUS}
                  fill={color}
                  opacity={isHovered ? 1 : 0.85}
                  style={{ transition: 'opacity 0.15s ease' }}
                />

                {/* Highlight stripe at top of bar */}
                <rect
                  x={x + 6}
                  y={y + 4}
                  width={BAR_WIDTH - 12}
                  height={6}
                  rx={3}
                  fill="rgba(255,255,255,0.22)"
                />

                {/* Score label above bar */}
                <text
                  x={x + BAR_WIDTH / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={800}
                  fill={color}
                  fontFamily="JetBrains Mono, monospace"
                >
                  {trend.score}%
                </text>

                {/* X-axis label: "Module N" */}
                <text
                  x={x + BAR_WIDTH / 2}
                  y={PADDING_TOP + CHART_HEIGHT + 20}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
                  fill="rgba(255,255,255,0.50)"
                  style={{ letterSpacing: '0.01em' }}
                >
                  Module {i + 1}
                </text>

                {/* ── Hover tooltip showing real module name ── */}
                {isHovered && (
                  <g>
                    {/* Tooltip background */}
                    <rect
                      x={tooltipX}
                      y={tooltipY}
                      width={tooltipW}
                      height={34}
                      rx={8}
                      fill="#1e2130"
                      stroke={color}
                      strokeWidth={1.5}
                      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
                    />
                    {/* Tooltip text — module name */}
                    <foreignObject
                      x={tooltipX + 8}
                      y={tooltipY + 6}
                      width={tooltipW - 16}
                      height={24}
                    >
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#fff',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: '22px',
                          fontFamily: 'Inter, sans-serif',
                        }}
                        title={trend.label}
                      >
                        {trend.label}
                      </div>
                    </foreignObject>
                    {/* Pointer arrow */}
                    <polygon
                      points={`${x + BAR_WIDTH / 2 - 5},${tooltipY + 34} ${x + BAR_WIDTH / 2 + 5},${tooltipY + 34} ${x + BAR_WIDTH / 2},${tooltipY + 42}`}
                      fill="#1e2130"
                      stroke={color}
                      strokeWidth={1.5}
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Colour legend */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginTop: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {[
          { color: '#22d3a0', label: '≥ 80% — Strong' },
          { color: '#f59e0b', label: '60–79% — Moderate' },
          { color: '#f87171', label: '< 60% — Needs work' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '11px',
                height: '11px',
                borderRadius: '3px',
                background: color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.45)',
                letterSpacing: '0.02em',
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
