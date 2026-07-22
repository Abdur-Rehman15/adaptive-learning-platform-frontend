import type { Question } from '@/features/course-questions/types/courseQuestions.types';

// ─── Core entities ──────────────────────────────────────────────────────────

export interface QuizAttempt {
  id: number;
  module_id: number;
  user_id: number;
  started_at: string;
  completed_at: string | null;
  final_score: number | null;
}

// ─── API response shapes ─────────────────────────────────────────────────────

/** Returned by POST /modules/{module_id}/quiz-attempts/start and /retry */
export interface QuizStartResponse {
  attempt: QuizAttempt;
  next_question: Question;
}

/** Returned by POST /quiz-attempts/{question_id}/answers/{attempt_id} */
export interface AnswerSubmitResponse {
  /** null when the quiz is finished and ready to be submitted */
  next_question: Question | null;
}

/** Returned by GET /modules/{module_id}/quiz-attempts */
export interface QuizAttemptSummary {
  id: number;
  module_id: number;
  started_at: string;
  completed_at: string | null;
  final_score: number | null;
  /** True when a non-completed attempt exists (resume scenario) */
  is_in_progress: boolean;
}

/** Returned by POST /modules/{module_id}/quiz-attempts/submit */
export interface QuizSubmitResponse {
  final_score: number;
  attempt_id: number;
}

// ─── Client-side state machine ───────────────────────────────────────────────

export type QuizPhase =
  | 'idle'
  | 'loading-summary'
  | 'starting'
  | 'in-progress'
  | 'submitting'
  | 'completed'
  | 'error';

export interface QuizState {
  phase: QuizPhase;
  attempt: QuizAttempt | null;
  currentQuestion: Question | null;
  /** IDs of questions that have already been answered in this attempt */
  answeredQuestionIds: number[];
  finalScore: number | null;
  errorMessage: string | null;
  /** True when a previous attempt exists (shows retry option) */
  hasPreviousAttempt: boolean;
  previousScore: number | null;
}
