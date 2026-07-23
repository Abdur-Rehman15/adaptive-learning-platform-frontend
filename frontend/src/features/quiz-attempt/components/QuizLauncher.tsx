import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizAttempt } from '../hooks/useQuizAttempt';

interface QuizLauncherProps {
  moduleId: number;
  moduleTitle: string;
  moduleOrder: number;
  compact?: boolean;
}

export const QuizLauncher = ({ moduleId, moduleTitle, moduleOrder, compact = false }: QuizLauncherProps) => {
  const navigate = useNavigate();
  const { phase, hasPreviousAttempt, previousScore, errorMessage, loadSummary } =
    useQuizAttempt(moduleId);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  const handleLaunch = () => {
    navigate(`/quiz/${moduleId}`);
  };

  const isLoading = phase === 'loading-summary';

  const hasPassed =
    hasPreviousAttempt && previousScore !== null && previousScore >= 50;

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {hasPreviousAttempt && previousScore !== null && (
          <span
            className={`quiz-launcher__score ${hasPassed ? 'quiz-launcher__score--pass' : 'quiz-launcher__score--fail'}`}
            style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
          >
            Best: {previousScore.toFixed(0)}%
          </span>
        )}

        {isLoading ? (
          <span className="quiz-launcher__loading" style={{ fontSize: '0.7rem' }}>CHECKING…</span>
        ) : (
          <button
            id={`quiz-launcher-btn-${moduleId}`}
            type="button"
            className={`dashboard-btn ${hasPreviousAttempt ? 'dashboard-btn--sunken' : 'dashboard-btn--primary'} quiz-launcher__btn`}
            style={{ padding: '4px 10px', fontSize: '0.7rem', textTransform: 'uppercase', height: '28px', minHeight: 'auto', boxShadow: '2px 2px 0 0 var(--color-border)' }}
            onClick={handleLaunch}
            aria-label={`${hasPreviousAttempt ? 'Retry quiz' : 'Start quiz'} for ${moduleTitle}`}
          >
            {hasPreviousAttempt ? 'Retry Quiz' : 'Start Quiz'}
          </button>
        )}

        {errorMessage && (
          <span style={{ fontSize: '0.7rem', color: 'var(--color-danger)' }}>!</span>
        )}
      </div>
    );
  }

  return (
    <div className="quiz-launcher">
      {/* Module order badge */}
      <div className="quiz-launcher__badge">
        Quiz · Module {String(moduleOrder).padStart(2, '0')}
      </div>

      <div className="quiz-launcher__body">
        <div className="quiz-launcher__info">
          <span className="quiz-launcher__title">{moduleTitle}</span>
          {hasPreviousAttempt && previousScore !== null && (
            <span
              className={`quiz-launcher__score ${hasPassed ? 'quiz-launcher__score--pass' : 'quiz-launcher__score--fail'}`}
            >
              Best: {previousScore.toFixed(1)}%
            </span>
          )}
        </div>

        {isLoading ? (
          <span className="quiz-launcher__loading">CHECKING…</span>
        ) : (
          <button
            id={`quiz-launcher-btn-${moduleId}`}
            type="button"
            className={`dashboard-btn ${hasPreviousAttempt ? 'dashboard-btn--sunken' : 'dashboard-btn--primary'} quiz-launcher__btn`}
            onClick={handleLaunch}
            aria-label={`${hasPreviousAttempt ? 'Retry quiz' : 'Start quiz'} for ${moduleTitle}`}
          >
            {hasPreviousAttempt ? (
              <>
                <span className="quiz-launcher__btn-icon">↺</span> Retry Quiz
              </>
            ) : (
              <>
                <span className="quiz-launcher__btn-icon">▶</span> Start Quiz
              </>
            )}
          </button>
        )}
      </div>

      {errorMessage && (
        <p className="quiz-launcher__error">{errorMessage}</p>
      )}
    </div>
  );
};

