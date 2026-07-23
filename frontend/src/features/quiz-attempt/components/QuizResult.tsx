import { useNavigate } from 'react-router-dom';

interface QuizResultProps {
  finalScore: number;
  moduleTitle: string;
  courseId?: number;
  onRetry: () => void;
  isRetrying: boolean;
}

export const QuizResult = ({
  finalScore,
  moduleTitle,
  courseId,
  onRetry,
  isRetrying,
}: QuizResultProps) => {
  const navigate = useNavigate();

  const score = finalScore != null ? Number(finalScore) : 0;
  const passed = score >= 50;
  const scoreDisplay = score.toFixed(1);

  const gradeLabel =
    score >= 90
      ? 'Outstanding'
      : score >= 75
        ? 'Proficient'
        : score >= 50
          ? 'Passing'
          : 'Needs Improvement';

  const gradeColor =
    score >= 90
      ? 'var(--color-success)'
      : score >= 75
        ? 'var(--color-primary)'
        : score >= 50
          ? 'var(--color-warning)'
          : 'var(--color-danger)';

  return (
    <div className="quiz-result">
      {/* Status badge */}
      <div
        className="quiz-result__status-badge"
        style={{
          background: passed ? 'var(--color-success)' : 'var(--color-danger)',
        }}
      >
        {passed ? '✓ PASSED' : '✗ FAILED'}
      </div>

      {/* Score ring */}
      <div className="quiz-result__score-ring" style={{ borderColor: gradeColor }}>
        <span className="quiz-result__score-number" style={{ color: gradeColor }}>
          {scoreDisplay}
        </span>
        <span className="quiz-result__score-unit">%</span>
      </div>

      {/* Grade label */}
      <div className="quiz-result__grade" style={{ color: gradeColor }}>
        {gradeLabel}
      </div>

      {/* Module reference */}
      <p className="quiz-result__module">
        Quiz completed for:{' '}
        <strong>{moduleTitle}</strong>
      </p>

      {/* Score progress bar */}
      <div className="quiz-result__bar-wrapper">
        <div className="quiz-result__bar-track">
          <div
            className="quiz-result__bar-fill"
            style={{
              width: `${Math.min(100, score)}%`,
              background: gradeColor,
            }}
          />
        </div>
        <div className="quiz-result__bar-labels">
          <span>0%</span>
          <span style={{ color: 'var(--color-warning)' }}>Pass: 50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Actions */}
      <div className="quiz-result__actions">
        <button
          id="quiz-retry-btn"
          type="button"
          className="dashboard-btn dashboard-btn--sunken quiz-result__btn"
          onClick={onRetry}
          disabled={isRetrying}
        >
          {isRetrying ? (
            <span className="quiz-view__spinner" />
          ) : (
            '↺ Retry Quiz'
          )}
        </button>

        <button
          id="quiz-back-btn"
          type="button"
          className="dashboard-btn dashboard-btn--primary quiz-result__btn"
          onClick={() => navigate(courseId ? '/courses' : '/courses')}
        >
          ← Back to Courses
        </button>
      </div>
    </div>
  );
};
