import { useCallback, useReducer } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  startQuizAttempt,
  retryQuizAttempt,
  submitAnswer,
  submitQuizAttempt,
  fetchQuizAttemptSummary,
  fetchAttemptAnswers,
} from '../api/quizAttempt.api';
import type { QuizState } from '../types/quizAttempt.types';
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
  | {
      type: 'QUIZ_STARTED';
      attempt_id: number;
      module_id: number;
      user_id: number;
      started_at: string;
      question: Question | null;
      answeredQuestionIds?: number[];
    }
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
      return { ...state, phase: 'loading-summary', errorMessage: null };

    case 'FETCH_SUMMARY_DONE':
      return {
        ...state,
        phase: 'idle',
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
        answeredQuestionIds: action.answeredQuestionIds ?? [],
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
      return {
        ...initialState,
        hasPreviousAttempt: state.hasPreviousAttempt,
        previousScore: state.previousScore,
      };

    default:
      return state;
  }
}

const parseErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong with the quiz.';

const extractSubmitScore = (response: QuizSubmitResponse | Record<string, unknown>) => {
  const rawScore =
    (response as QuizSubmitResponse).final_score ??
    (response as Record<string, unknown>).finalScore ??
    (response as Record<string, unknown>).score ??
    (response as { attempt?: { final_score?: number } }).attempt?.final_score;

  return rawScore != null && Number.isFinite(Number(rawScore)) ? Number(rawScore) : null;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useQuizAttempt = (moduleId: number) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const syncSummary = useCallback(async () => {
    if (!token) return null;

    dispatch({ type: 'FETCH_SUMMARY_START' });
    const summary = await fetchQuizAttemptSummary(token, moduleId);

    dispatch({
      type: 'FETCH_SUMMARY_DONE',
      hasPrevious: summary !== null && summary.final_score !== null,
      previousScore: summary?.final_score ?? null,
      isInProgress: summary?.is_in_progress ?? false,
    });

    return summary;
  }, [token, moduleId]);

  const beginAttempt = useCallback(
    async (mode: 'start' | 'retry') => {
      if (!token) return;

      dispatch({ type: 'START_LOADING' });

      try {
        const summary = await fetchQuizAttemptSummary(token, moduleId);
        const response =
          mode === 'retry'
            ? await retryQuizAttempt(token, moduleId)
            : await startQuizAttempt(token, moduleId);

        const answeredQuestionIds =
          summary?.is_in_progress && mode === 'start'
            ? (await fetchAttemptAnswers(token, response.attempt.id)).map(
                (answer) => answer.question_id
              )
            : [];

        dispatch({
          type: 'QUIZ_STARTED',
          attempt_id: response.attempt.id,
          module_id: response.attempt.module_id,
          user_id: response.attempt.user_id,
          started_at: response.attempt.started_at,
          question: response.next_question,
          answeredQuestionIds,
        });
      } catch (error) {
        const message = parseErrorMessage(error);

        if (
          mode === 'start' &&
          message.toLowerCase().includes('no unanswered questions remain')
        ) {
          const summary = await fetchQuizAttemptSummary(token, moduleId);
          if (summary?.is_in_progress) {
            const answeredQuestionIds = (await fetchAttemptAnswers(token, summary.id)).map(
              (answer) => answer.question_id
            );

            dispatch({
              type: 'QUIZ_STARTED',
              attempt_id: summary.id,
              module_id: summary.module_id,
              user_id: summary.user_id,
              started_at: summary.started_at,
              question: null,
              answeredQuestionIds,
            });
            return;
          }
        }

        dispatch({ type: 'ERROR', message });
      }
    },
    [token, moduleId]
  );

  /** Load summary and start/resume/show completed state on page entry */
  const initializeQuiz = useCallback(async () => {
    if (!token) return;

    try {
      const summary = await syncSummary();

      if (summary?.completed_at && summary.final_score != null) {
        dispatch({ type: 'QUIZ_COMPLETED', finalScore: summary.final_score });
        return;
      }

      await beginAttempt('start');
    } catch (error) {
      dispatch({ type: 'ERROR', message: parseErrorMessage(error) });
    }
  }, [token, syncSummary, beginAttempt]);

  const loadSummary = syncSummary;

  const startQuiz = useCallback(async () => {
    await beginAttempt('start');
  }, [beginAttempt]);

  const retryQuiz = useCallback(async () => {
    await beginAttempt('retry');
  }, [beginAttempt]);

  const answerQuestion = useCallback(
    async (selectedOption: string) => {
      if (!token || !state.attempt || !state.currentQuestion) return;

      try {
        const response = await submitAnswer(
          token,
          state.currentQuestion.id,
          state.attempt.id,
          selectedOption
        );
        dispatch({ type: 'ANSWER_SUBMITTED', nextQuestion: response.next_question });
      } catch (error) {
        dispatch({ type: 'ERROR', message: parseErrorMessage(error) });
      }
    },
    [token, state.attempt, state.currentQuestion]
  );

  const finishQuiz = useCallback(async () => {
    if (!token || !state.attempt) return;

    dispatch({ type: 'SUBMIT_LOADING' });

    try {
      const response = await submitQuizAttempt(token, moduleId);
      let finalScore = extractSubmitScore(response);

      if (finalScore === null) {
        const summary = await fetchQuizAttemptSummary(token, moduleId);
        if (summary?.final_score != null) {
          finalScore = summary.final_score;
        }
      }

      dispatch({ type: 'QUIZ_COMPLETED', finalScore: finalScore ?? 0 });

      void queryClient.invalidateQueries({ queryKey: ['learner-dashboard'] });
      void queryClient.invalidateQueries({ queryKey: ['student-courses'] });
    } catch (error) {
      dispatch({ type: 'ERROR', message: parseErrorMessage(error) });
    }
  }, [token, state.attempt, moduleId, queryClient]);

  const recoverFromError = useCallback(async () => {
    if (!token) return;

    const message = state.errorMessage?.toLowerCase() ?? '';

    if (message.includes('already completed') || message.includes('retry instead')) {
      await retryQuiz();
      return;
    }

    if (message.includes('never started') && state.hasPreviousAttempt) {
      await startQuiz();
      return;
    }

    await initializeQuiz();
  }, [token, state.errorMessage, state.hasPreviousAttempt, retryQuiz, startQuiz, initializeQuiz]);

  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    ...state,
    loadSummary,
    initializeQuiz,
    startQuiz,
    retryQuiz,
    answerQuestion,
    finishQuiz,
    recoverFromError,
    reset,
  };
};
