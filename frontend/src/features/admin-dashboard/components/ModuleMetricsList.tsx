import { useState } from 'react';
import type { InstructorModuleMetric } from '../types/adminDashboard.types';

interface ModuleMetricsListProps {
  modules: InstructorModuleMetric[];
}

const COLOR_COMPLETION = '#818cf8';
const COLOR_SCORE = '#22d3a0';

const CHART_HEIGHT = 200;
const BAR_RADIUS = 6;
const PADDING_LEFT = 48;
const PADDING_RIGHT = 20;
const PADDING_TOP = 28;
const PADDING_BOTTOM = 48;
const INNER_GAP = 5;
const GROUP_GAP = 70;

const gridLines = [0, 25, 50, 75, 100];

export const ModuleMetricsList = ({ modules }: ModuleMetricsListProps) => {
  const [hoveredInfo, setHoveredInfo] = useState<{
    x: number; y: number; label: string; value: number; type: 'completion' | 'score';
  } | null>(null);

  if (modules.length === 0) {
    return (
      <section className="dashboard-panel">
        <div className="dashboard-panel__header">
          <div>
            <p className="dashboard-panel__eyebrow admin-eyebrow">Structure</p>
            <h2 className="dashboard-panel__title">Active Module Performance</h2>
          </div>
          <p className="dashboard-panel__description">Learner statistics and scores per module.</p>
        </div>
        <p className="dashboard-panel__empty">No modules found for this course.</p>
      </section>
    );
  }

  const n = modules.length;

  const BAR_WIDTH = Math.max(14, Math.min(30, Math.floor(460 / n) / 2 - INNER_GAP));
  const GROUP_WIDTH = BAR_WIDTH * 2 + INNER_GAP;
  const innerWidth = n * (GROUP_WIDTH + GROUP_GAP) - GROUP_GAP;
  const svgWidth = innerWidth + PADDING_LEFT + PADDING_RIGHT;
  const svgHeight = CHART_HEIGHT + PADDING_TOP + PADDING_BOTTOM;

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="dashboard-panel__eyebrow" style={{ color: 'var(--color-accent)' }}>Structure</p>
          <h2 className="dashboard-panel__title">Active Module Performance</h2>
        </div>
        <p className="dashboard-panel__description">
          Completion rate vs average quiz score per module — hover a bar for details.
        </p>
      </div>

      <div
        style={{
          overflowX: 'auto',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '8px',
          position: 'relative',
        }}
      >
        <svg
          width={Math.max(svgWidth, 300)}
          height={svgHeight}
          style={{ display: 'block', fontFamily: 'Inter, sans-serif', overflow: 'visible' }}
          aria-label="Module performance grouped bar chart"
          role="img"
          onMouseLeave={() => setHoveredInfo(null)}
        >
          {/* Y-axis gridlines */}
          {gridLines.map((pct) => {
            const y = PADDING_TOP + CHART_HEIGHT - (pct / 100) * CHART_HEIGHT;
            return (
              <g key={pct}>
                <line
                  x1={PADDING_LEFT} x2={PADDING_LEFT + innerWidth}
                  y1={y} y2={y}
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth={1}
                  strokeDasharray={pct === 0 ? 'none' : '4 4'}
                />
                <text
                  x={PADDING_LEFT - 8} y={y + 4}
                  textAnchor="end" fontSize={11}
                  fill="rgba(255,255,255,0.35)" fontWeight={600}
                >
                  {pct}
                </text>
              </g>
            );
          })}

          {/* Grouped bars per module */}
          {modules.map((mod, i) => {
            const groupX = PADDING_LEFT + i * (GROUP_WIDTH + GROUP_GAP);

            const compH = Math.max(4, (mod.completionRate / 100) * CHART_HEIGHT);
            const scoreH = Math.max(4, (mod.averageScore / 100) * CHART_HEIGHT);
            const compY = PADDING_TOP + CHART_HEIGHT - compH;
            const scoreY = PADDING_TOP + CHART_HEIGHT - scoreH;

            const compBarX = groupX;
            const scoreBarX = groupX + BAR_WIDTH + INNER_GAP;

            const centerX = groupX + GROUP_WIDTH / 2;

            return (
              <g key={mod.id}>
                {/* ── Completion Rate bar ── */}
                <g
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() =>
                    setHoveredInfo({
                      x: compBarX + BAR_WIDTH / 2,
                      y: compY,
                      label: mod.title,
                      value: mod.completionRate,
                      type: 'completion',
                    })
                  }
                >
                  {/* shadow */}
                  <rect
                    x={compBarX + 2} y={compY + 4}
                    width={BAR_WIDTH} height={compH}
                    rx={BAR_RADIUS} ry={BAR_RADIUS}
                    fill={COLOR_COMPLETION} opacity={0.15}
                  />
                  {/* bar */}
                  <rect
                    x={compBarX} y={compY}
                    width={BAR_WIDTH} height={compH}
                    rx={BAR_RADIUS} ry={BAR_RADIUS}
                    fill={COLOR_COMPLETION} opacity={0.85}
                  />
                  {/* shine */}
                  <rect
                    x={compBarX + 4} y={compY + 4}
                    width={BAR_WIDTH - 8} height={5}
                    rx={2} fill="rgba(255,255,255,0.2)"
                  />
                  {/* value label */}
                  <text
                    x={compBarX + BAR_WIDTH / 2} y={compY - 6}
                    textAnchor="middle" fontSize={10}
                    fontWeight={700} fill={COLOR_COMPLETION}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {mod.completionRate}%
                  </text>
                </g>

                {/* ── Average Score bar ── */}
                <g
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() =>
                    setHoveredInfo({
                      x: scoreBarX + BAR_WIDTH / 2,
                      y: scoreY,
                      label: mod.title,
                      value: mod.averageScore,
                      type: 'score',
                    })
                  }
                >
                  {/* shadow */}
                  <rect
                    x={scoreBarX + 2} y={scoreY + 4}
                    width={BAR_WIDTH} height={scoreH}
                    rx={BAR_RADIUS} ry={BAR_RADIUS}
                    fill={COLOR_SCORE} opacity={0.15}
                  />
                  {/* bar */}
                  <rect
                    x={scoreBarX} y={scoreY}
                    width={BAR_WIDTH} height={scoreH}
                    rx={BAR_RADIUS} ry={BAR_RADIUS}
                    fill={COLOR_SCORE} opacity={0.85}
                  />
                  {/* shine */}
                  <rect
                    x={scoreBarX + 4} y={scoreY + 4}
                    width={BAR_WIDTH - 8} height={5}
                    rx={2} fill="rgba(255,255,255,0.2)"
                  />
                  {/* value label */}
                  <text
                    x={scoreBarX + BAR_WIDTH / 2} y={scoreY - 6}
                    textAnchor="middle" fontSize={10}
                    fontWeight={700} fill={COLOR_SCORE}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {mod.averageScore}%
                  </text>
                </g>

                {/* ── X-axis group label: "Mod N" ── */}
                <text
                  x={centerX}
                  y={PADDING_TOP + CHART_HEIGHT + 18}
                  textAnchor="middle" fontSize={11}
                  fontWeight={600} fill="rgba(255,255,255,0.50)"
                >
                  Mod {i + 1}
                </text>

                {/* ── Learner count below Mod N ── */}
                <text
                  x={centerX}
                  y={PADDING_TOP + CHART_HEIGHT + 34}
                  textAnchor="middle" fontSize={9}
                  fill="rgba(255,255,255,0.28)"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {mod.learners}👤
                </text>
              </g>
            );
          })}

          {/* ── Hover tooltip ── */}
          {hoveredInfo && (() => {
            const tooltipW = 170;
            const tooltipH = 44;
            const tooltipX = Math.max(PADDING_LEFT, hoveredInfo.x - tooltipW / 2);
            const tooltipY = Math.max(4, hoveredInfo.y - tooltipH - 10);
            const color = hoveredInfo.type === 'completion' ? COLOR_COMPLETION : COLOR_SCORE;
            const typeLabel = hoveredInfo.type === 'completion' ? 'Completion Rate' : 'Avg Score';

            return (
              <g>
                <rect
                  x={tooltipX} y={tooltipY}
                  width={tooltipW} height={tooltipH}
                  rx={8} fill="#1e2130"
                  stroke={color} strokeWidth={1.5}
                  style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.55))' }}
                />
                {/* type badge */}
                <text
                  x={tooltipX + 10} y={tooltipY + 15}
                  fontSize={9} fontWeight={700} fill={color}
                  textTransform="uppercase" style={{ letterSpacing: '0.06em' }}
                >
                  {typeLabel}
                </text>
                {/* module name */}
                <foreignObject
                  x={tooltipX + 8} y={tooltipY + 20}
                  width={tooltipW - 16} height={20}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#fff',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    title={hoveredInfo.label}
                  >
                    {hoveredInfo.label} — {hoveredInfo.value}%
                  </div>
                </foreignObject>
                {/* pointer */}
                <polygon
                  points={`${hoveredInfo.x - 5},${tooltipY + tooltipH} ${hoveredInfo.x + 5},${tooltipY + tooltipH} ${hoveredInfo.x},${tooltipY + tooltipH + 8}`}
                  fill="#1e2130" stroke={color} strokeWidth={1.5}
                />
              </g>
            );
          })()}
        </svg>
      </div>

      {/* ── Legend ──────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginTop: '14px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {[
          { color: COLOR_COMPLETION, label: 'Completion Rate' },
          { color: COLOR_SCORE, label: 'Average Quiz Score' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '11px', height: '11px',
                borderRadius: '3px',
                background: color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '0.72rem', fontWeight: 600,
                color: 'rgba(255,255,255,0.50)',
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
