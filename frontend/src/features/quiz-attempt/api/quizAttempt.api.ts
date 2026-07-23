import { apiFetch } from '@/api/client';
import type {
  QuizAttemptSummary,
  QuizStartResponse,
  AnswerSubmitResponse,
  QuizSubmitResponse,
  QuizAnswerRecord,
} from '../types/quizAttempt.types';

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

// ─── Quiz attempt lifecycle ───────────────────────────────────────────────────

/**
 * GET /modules/{module_id}/quiz-attempts
 * Fetches the latest attempt summary for the given module.
 * Returns null-like summary when no attempt exists.
 */
export const fetchQuizAttemptSummary = async (
  token: string,
  moduleId: number
): Promise<QuizAttemptSummary | null> => {
  try {
    const raw = await apiFetch<unknown>(`/modules/${moduleId}/quiz-attempts`, {
      method: 'GET',
      headers: authHeaders(token),
    });

    if (!raw || typeof raw !== 'object') return null;
    const r = raw as Record<string, unknown>;

    return {
      id: Number(r.id ?? 0),
      module_id: Number(r.module_id ?? moduleId),
      user_id: Number(r.user_id ?? 0),
      started_at: String(r.started_at ?? ''),
      completed_at: r.completed_at ? String(r.completed_at) : null,
      final_score: r.final_score != null ? Number(r.final_score) : null,
      is_in_progress: r.completed_at == null && r.id != null,
    };
  } catch {
    return null;
  }
};

/**
 * POST /modules/{module_id}/quiz-attempts/start
 * Starts a fresh quiz or resumes an in-progress one.
 * Returns the attempt object plus the first/next question.
 */
export const startQuizAttempt = async (
  token: string,
  moduleId: number
): Promise<QuizStartResponse> => {
  return apiFetch<QuizStartResponse>(
    `/modules/${moduleId}/quiz-attempts/start`,
    {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({}),
    }
  );
};

/**
 * POST /modules/{module_id}/quiz-attempts/retry
 * Starts a brand-new retry attempt (replaces previous).
 */
export const retryQuizAttempt = async (
  token: string,
  moduleId: number
): Promise<QuizStartResponse> => {
  return apiFetch<QuizStartResponse>(
    `/modules/${moduleId}/quiz-attempts/retry`,
    {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({}),
    }
  );
};

/**
 * POST /modules/{module_id}/quiz-attempts/submit
 * Finalizes the quiz and calculates the final score.
 */
export const submitQuizAttempt = async (
  token: string,
  moduleId: number
): Promise<QuizSubmitResponse> => {
  return apiFetch<QuizSubmitResponse>(
    `/modules/${moduleId}/quiz-attempts/submit`,
    {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({}),
    }
  );
};

// ─── Answer submission ────────────────────────────────────────────────────────

/**
 * POST /quiz-attempts/{question_id}/answers/{attempt_id}
 * Submits one answer. The backend's adaptive engine returns the
 * next question (or null when all questions are answered).
 */
export const submitAnswer = async (
  token: string,
  questionId: number,
  attemptId: number,
  selectedOption: string
): Promise<AnswerSubmitResponse> => {
  return apiFetch<AnswerSubmitResponse>(
    `/quiz-attempts/${questionId}/answers/${attemptId}`,
    {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ chosen_option: selectedOption }),
    }
  );
};

/**
 * GET /quiz-attempts/{attempt_id}/answers
 * Returns previously submitted answers for an in-progress attempt.
 */
export const fetchAttemptAnswers = async (
  token: string,
  attemptId: number
): Promise<QuizAnswerRecord[]> => {
  try {
    const raw = await apiFetch<unknown>(`/quiz-attempts/${attemptId}/answers`, {
      method: 'GET',
      headers: authHeaders(token),
    });

    return normalizeList(raw).map((item) => {
      const entry = item as Record<string, unknown>;
      return {
        id: Number(entry.id ?? 0),
        question_id: Number(entry.question_id ?? 0),
        attempt_id: Number(entry.attempt_id ?? attemptId),
        is_correct: Boolean(entry.is_correct),
        difficulty_at_time: String(entry.difficulty_at_time ?? 'medium'),
      };
    });
  } catch {
    return [];
  }
};

const normalizeList = (rawValue: unknown): unknown[] => {
  if (Array.isArray(rawValue)) {
    return rawValue;
  }

  if (rawValue && typeof rawValue === 'object' && Array.isArray((rawValue as { data?: unknown[] }).data)) {
    return (rawValue as { data: unknown[] }).data;
  }

  return [];
};

// ─── Certificate download ─────────────────────────────────────────────────────

/**
 * GET /certificates/download/{course_id}
 * Downloads the certificate PDF as a Blob and triggers browser save dialog.
 */
export const downloadCertificate = async (
  token: string,
  courseId: number
): Promise<void> => {
  const BASE_URL =
    (import.meta as unknown as { env: Record<string, string> }).env
      .VITE_API_BASE_URL || 'http://localhost:8000';

  const res = await fetch(`${BASE_URL}/certificates/download/${courseId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Certificate download failed: ${res.status}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `certificate-course-${courseId}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
