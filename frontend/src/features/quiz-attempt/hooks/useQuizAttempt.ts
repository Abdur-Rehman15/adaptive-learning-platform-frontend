import { useCallback, useReducer } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  startQuizAttempt,
  retryQuizAttempt,
  submitAnswer,
  submitQuizAttempt,
  fetchQuizAttemptSummary,
} from '../api/quizAttempt.api';
import type { QuizState, QuizPhase } from '../types/quizAttempt.types';
import type { Question } from '@/features/course-questions/types/courseQuestions.types';

// ─── State machine ────────────────────────────────────────────────────────────

type QuizAction =
  | { type: 'FETCH_SUMMARY_START' }
  | {
      type: 'FETCH_SUMMARY_DONE';
      hasPrevious: boolean;
      previousScore: number | null;
      isInProgress: boolean;
    }
  | { type: 'START_LOADING' }
  | { type: 'QUIZ_STARTED'; attempt_id: number; module_id: number; user_id: number; started_at: string; question: Question }
  | { type: 'ANSWER_SUBMITTED'; nextQuestion: Question | null }
  | { type: 'SUBMIT_LOADING' }
  | { type: 'QUIZ_COMPLETED'; finalScore: number }
  | { type: 'ERROR'; message: string }
  | { type: 'RESET' };

const initialState: QuizState = {
  phase: 'idle',
  attempt: null,
  currentQuestion: null,
  answeredQuestionIds: [],
  finalScore: null,
  errorMessage: null,
  hasPreviousAttempt: false,
  previousScore: null,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'FETCH_SUMMARY_START':
      return { ...state, phase: 'loading-summary' };

    case 'FETCH_SUMMARY_DONE':
      return {
        ...state,
        phase: action.isInProgress ? 'idle' : 'idle',
        hasPreviousAttempt: action.hasPrevious,
        previousScore: action.previousScore,
      };

    case 'START_LOADING':
      return { ...state, phase: 'starting', errorMessage: null };

    case 'QUIZ_STARTED':
      return {
        ...state,
        phase: 'in-progress',
        attempt: {
          id: action.attempt_id,
          module_id: action.module_id,
          user_id: action.user_id,
          started_at: action.started_at,
          completed_at: null,
          final_score: null,
        },
        currentQuestion: action.question,
        answeredQuestionIds: [],
        finalScore: null,
        errorMessage: null,
      };

    case 'ANSWER_SUBMITTED': {
      const newAnswered = state.currentQuestion
        ? [...state.answeredQuestionIds, state.currentQuestion.id]
        : state.answeredQuestionIds;

      return {
        ...state,
        answeredQuestionIds: newAnswered,
        // null next_question → all questions answered, ready to submit
        currentQuestion: action.nextQuestion,
        phase: 'in-progress',
      };
    }

    case 'SUBMIT_LOADING':
      return { ...state, phase: 'submitting' };

    case 'QUIZ_COMPLETED':
      return {
        ...state,
        phase: 'completed',
        finalScore: action.finalScore,
        hasPreviousAttempt: true,
        previousScore: action.finalScore,
        currentQuestion: null,
        attempt: state.attempt
          ? { ...state.attempt, final_score: action.finalScore, completed_at: new Date().toISOString() }
          : null,
      };

    case 'ERROR':
      return { ...state, phase: 'error', errorMessage: action.message };

    case 'RESET':
      return { ...initialState, hasPreviousAttempt: state.hasPreviousAttempt, previousScore: state.previousScore };

    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useQuizAttempt = (moduleId: number) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(quizReducer, initialState);

  /** Load summary on mount (called from QuizLauncher) */
  const loadSummary = useCallback(async () => {
    if (!token) return;
    dispatch({ type: 'FETCH_SUMMARY_START' });
    const summary = await fetchQuizAttemptSummary(token, moduleId);
    dispatch({
      type: 'FETCH_SUMMARY_DONE',
      hasPrevious: summary !== null && summary.final_score !== null,
      previousScore: summary?.final_score ?? null,
      isInProgress: summary?.is_in_progress ?? false,
    });
  }, [token, moduleId]);

  /** Start or resume a quiz */
  const startQuiz = useCallback(async () => {
    if (!token) return;
    dispatch({ type: 'START_LOADING' });
    try {
      const res = await startQuizAttempt(token, moduleId);
      dispatch({
        type: 'QUIZ_STARTED',
        attempt_id: res.attempt.id,
        module_id: res.attempt.module_id,
        user_id: res.attempt.user_id,
        started_at: res.attempt.started_at,
        question: res.next_question,
      });
    } catch (err) {
      dispatch({ type: 'ERROR', message: (err as Error).message });
    }
  }, [token, moduleId]);

  /** Retry — start a fresh attempt */
  const retryQuiz = useCallback(async () => {
    if (!token) return;
    dispatch({ type: 'START_LOADING' });
    try {
      const res = await retryQuizAttempt(token, moduleId);
      dispatch({
        type: 'QUIZ_STARTED',
        attempt_id: res.attempt.id,
        module_id: res.attempt.module_id,
        user_id: res.attempt.user_id,
        started_at: res.attempt.started_at,
        question: res.next_question,
      });
    } catch (err) {
      dispatch({ type: 'ERROR', message: (err as Error).message });
    }
  }, [token, moduleId]);

  /** Submit an answer for the current question */
  const answerQuestion = useCallback(
    async (selectedOption: string) => {
      if (!token || !state.attempt || !state.currentQuestion) return;
      try {
        const res = await submitAnswer(
          token,
          state.currentQuestion.id,
          state.attempt.id,
          selectedOption
        );
        dispatch({ type: 'ANSWER_SUBMITTED', nextQuestion: res.next_question });
      } catch (err) {
        dispatch({ type: 'ERROR', message: (err as Error).message });
      }
    },
    [token, state.attempt, state.currentQuestion]
  );

  /** Final submit — calculate score */
  const finishQuiz = useCallback(async () => {
    if (!token || !state.attempt) return;
    dispatch({ type: 'SUBMIT_LOADING' });
    try {
      const res = await submitQuizAttempt(token, moduleId);
      console.log('Quiz submission raw response:', res);

      // ── Primary: parse score from submit response ──────────────────────────
      const rawScore = res && (
        (res as any).final_score ??
        (res as any).finalScore ??
        (res as any).score ??
        (res as any).attempt?.final_score ??
        (res as any).attempt?.finalScore ??
        (res as any).attempt?.score
      );
      const scoreFromSubmit = rawScore != null ? Number(rawScore) : null;

      // ── Fallback: fetch the authoritative score from the GET summary ────────
      // This guarantees we always show the real DB-persisted score even if the
      // submit response body is shaped differently than expected.
      let finalScore = scoreFromSubmit;
      if (finalScore === null || finalScore === 0) {
        const summary = await fetchQuizAttemptSummary(token, moduleId);
        console.log('Quiz summary fallback response:', summary);
        if (summary?.final_score != null && summary.final_score > 0) {
          finalScore = summary.final_score;
        }
      }

      const score = finalScore ?? 0;
      dispatch({ type: 'QUIZ_COMPLETED', finalScore: score });

      // Invalidate all relevant queries so progress updates across the app
      void queryClient.invalidateQueries({ queryKey: ['learner-dashboard'] });
      void queryClient.invalidateQueries({ queryKey: ['student-courses'] });
    } catch (err) {
      dispatch({ type: 'ERROR', message: (err as Error).message });
    }
  }, [token, state.attempt, moduleId, queryClient]);

  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    ...state,
    loadSummary,
    startQuiz,
    retryQuiz,
    answerQuestion,
    finishQuiz,
    reset,
  };
};
