import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useQuizAttempt } from '@/features/quiz-attempt/hooks/useQuizAttempt';
import { QuizView } from '@/features/quiz-attempt/components/QuizView';
import { QuizResult } from '@/features/quiz-attempt/components/QuizResult';
import { fetchCourseModules } from '@/features/studentCourses/api/studentCourses.api';
import { fetchLearnerEnrollments } from '@/features/learner-dashboard/api/learnerDashboard.api';
import type { ModuleResponse } from '@/features/admin-dashboard/api/adminCourse.api';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const QuizAttemptPage = () => {
  const { moduleId: moduleIdParam } = useParams<{ moduleId: string }>();
  const moduleId = Number(moduleIdParam);
  const navigate = useNavigate();
  const { token, role } = useAuth();

  const {
    phase,
    attempt,
    currentQuestion,
    answeredQuestionIds,
    finalScore,
    errorMessage,
    hasPreviousAttempt,
    startQuiz,
    retryQuiz,
    answerQuestion,
    finishQuiz,
    recoverFromError,
    initializeQuiz,
  } = useQuizAttempt(moduleId);

  // ─── Fetch module info for context ─────────────────────────────────────────
  const { data: enrollments = [] } = useQuery({
    queryKey: ['learner-dashboard', 'enrollments', token],
    queryFn: () => fetchLearnerEnrollments(token as string),
    enabled: Boolean(token),
  });

  // We need course_id → find via modules. Load modules from the first enrollment's course.
  // Since we only have moduleId here, we query each enrolled course's modules until we find it.
  const { data: moduleInfo } = useQuery<ModuleResponse | undefined>({
    queryKey: ['quiz-page', 'module-info', moduleId, token],
    queryFn: async () => {
      if (!token || enrollments.length === 0) return undefined;
      for (const enrollment of enrollments) {
        const mods = await fetchCourseModules(token, Number(enrollment.courseId));
        const found = mods.find((m) => m.id === moduleId);
        if (found) return found;
      }
      return undefined;
    },
    enabled: Boolean(token && enrollments.length > 0),
  });

  // ─── Initialize quiz: resume in-progress, show completed, or start fresh ──
  useEffect(() => {
    if (!token || !moduleId) return;
    if (phase === 'idle') {
      void initializeQuiz();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, moduleId]);

  const moduleTitle = moduleInfo?.title ?? `Module ${moduleId}`;
  const questionNumber = answeredQuestionIds.length + 1;
  // next_question is null → all questions answered, show "Submit Quiz"
  const canFinish = phase === 'in-progress' && currentQuestion === null;

  // ─── Derived course ID for cert download hint ─────────────────────────────
  const courseId = moduleInfo?.course_id;

  if (!role) return null;

  return (
    <div className="app-shell">
      <Navbar role={role} />
      <main className="app-shell__content">
        <div className="quiz-shell">

          {/* ── Back navigation ── */}
          <div className="quiz-page__nav">
            <button
              type="button"
              className="dashboard-btn dashboard-btn--sunken"
              style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
              onClick={() => navigate('/courses')}
            >
              ← Back to Courses
            </button>
            <div className="quiz-page__breadcrumb">
              <span style={{ color: 'var(--color-ink-soft)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
                ADAPTIVE QUIZ
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', fontWeight: 700 }}>
                {moduleTitle}
              </span>
            </div>
          </div>

          {/* ── Phase: starting / loading ── */}
          {(phase === 'idle' || phase === 'starting' || phase === 'loading-summary') && (
            <div className="quiz-shell__loading">
              <div className="quiz-shell__loading-spinner" />
              <p className="quiz-shell__loading-text">
                {phase === 'starting' ? 'INITIALIZING ADAPTIVE ENGINE…' : 'LOADING QUIZ…'}
              </p>
            </div>
          )}

          {/* ── Phase: in-progress → question display ── */}
          {phase === 'in-progress' && currentQuestion && (
            <>
              {/* Progress tracker */}
              <div className="quiz-progress-wrapper">
                <div className="quiz-progress-label">
                  <span>Questions Answered</span>
                  <span className="quiz-progress-count">{answeredQuestionIds.length}</span>
                </div>
                <div className="quiz-progress-bar">
                  <div
                    className="quiz-progress-bar__fill"
                    style={{
                      width: `${Math.min(100, (answeredQuestionIds.length / Math.max(1, answeredQuestionIds.length + 1)) * 100)}%`,
                    }}
                  />
                </div>
                <div className="quiz-progress-meta">
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--color-ink-soft)' }}>
                    ATTEMPT #{attempt?.id} · ADAPTIVE MODE
                  </span>
                </div>
              </div>

              <QuizView
                currentQuestion={currentQuestion}
                questionNumber={questionNumber}
                isSubmitting={(phase as string) === 'submitting'}
                canFinish={false}
                onAnswer={answerQuestion}
                onFinish={finishQuiz}
              />
            </>
          )}

          {/* ── Phase: all answered, ready to finalize ── */}
          {phase === 'in-progress' && canFinish && (
            <div className="quiz-shell__finish">
              <div className="quiz-card quiz-shell__finish-card">
                <div className="quiz-shell__finish-icon">✓</div>
                <h2 className="quiz-shell__finish-title">All Questions Answered!</h2>
                <p className="quiz-shell__finish-text">
                  You have answered <strong>{answeredQuestionIds.length}</strong> question
                  {answeredQuestionIds.length !== 1 ? 's' : ''}. Click below to calculate your final score.
                </p>
                <button
                  id="quiz-submit-final-btn"
                  type="button"
                  className="dashboard-btn dashboard-btn--primary"
                  style={{ marginTop: '24px', width: '100%', padding: '14px' }}
                  onClick={() => void finishQuiz()}
                >
                  ⬆ Submit Quiz &amp; See Results
                </button>
              </div>
            </div>
          )}

          {/* ── Phase: submitting ── */}
          {phase === 'submitting' && (
            <div className="quiz-shell__loading">
              <div className="quiz-shell__loading-spinner" />
              <p className="quiz-shell__loading-text">CALCULATING SCORE…</p>
            </div>
          )}

          {/* ── Phase: completed ── */}
          {phase === 'completed' && finalScore !== null && (
            <QuizResult
              finalScore={finalScore}
              moduleTitle={moduleTitle}
              courseId={courseId}
              onRetry={() => void retryQuiz()}
              isRetrying={(phase as string) === 'starting'}
            />
          )}

          {/* ── Phase: error ── */}
          {phase === 'error' && (
            <div className="quiz-shell__error">
              <div className="quiz-card" style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ fontSize: '2rem', marginBottom: '16px' }}>⚠</p>
                <h2 style={{ marginBottom: '12px' }}>Quiz Error</h2>
                <p style={{ color: 'var(--color-danger)', marginBottom: '24px' }}>
                  {errorMessage}
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="dashboard-btn dashboard-btn--sunken"
                    onClick={() => navigate('/courses')}
                  >
                    ← Back to Courses
                  </button>
                  <button
                    type="button"
                    className="dashboard-btn dashboard-btn--primary"
                    onClick={() => void recoverFromError()}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer role={role} />
    </div>
  );
};

export default QuizAttemptPage;
