import { useState } from 'react';
import type { Question } from '../types/courseQuestions.types';

interface QuestionListProps {
  questions: Question[];
  isLoading: boolean;
  onEdit: (question: Question) => void;
  onDelete: (questionId: number) => void;
  isDeleting: boolean;
}

const DIFFICULTY_LABEL_CLASS: Record<string, string> = {
  easy: 'q-badge q-badge--easy',
  medium: 'q-badge q-badge--medium',
  hard: 'q-badge q-badge--hard',
};

const TYPE_LABEL: Record<string, string> = {
  multiple_choice: 'MCQ',
  true_false: 'T/F',
};

export const QuestionList = ({
  questions,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
}: QuestionListProps) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="q-list__loading">
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--color-ink-faint)' }}>
          LOADING QUESTIONS…
        </span>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="q-list__empty">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ color: 'var(--color-ink-faint)', marginBottom: '12px' }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p style={{ fontWeight: 700, margin: '0 0 4px' }}>No questions yet</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-soft)', margin: 0 }}>
          Click "+ Add Question" to create the first question for this module.
        </p>
      </div>
    );
  }

  const handleDeleteClick = (questionId: number) => {
    if (confirmDeleteId === questionId) {
      onDelete(questionId);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(questionId);
    }
  };

  return (
    <div className="q-list">
      {questions.map((q, idx) => (
        <div
          key={q.id}
          className="q-card"
          style={{ animationDelay: `${idx * 40}ms` }}
        >
          <div className="q-card__toprow">
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 700,
                fontSize: '0.75rem',
                color: 'var(--color-ink-faint)',
              }}
            >
              Q{String(idx + 1).padStart(2, '0')}
            </span>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: 'auto' }}>
              <span className={DIFFICULTY_LABEL_CLASS[q.difficulty] ?? 'q-badge'}>
                {q.difficulty}
              </span>
              <span className="q-badge q-badge--type">
                {TYPE_LABEL[q.question_type] ?? q.question_type}
              </span>
            </div>
          </div>

          <p className="q-card__text">{q.text}</p>

          <p className="q-card__topic">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            {q.topic}
          </p>

          <div className="q-card__options">
            {q.options.map((opt) => (
              <span
                key={opt}
                className={`q-option-chip${opt === q.correct_option ? ' q-option-chip--correct' : ''}`}
              >
                {opt === q.correct_option && '✓ '}
                {opt}
              </span>
            ))}
          </div>

          <div className="q-card__actions">
            <button
              type="button"
              onClick={() => {
                setConfirmDeleteId(null);
                onEdit(q);
              }}
              className="q-action-btn q-action-btn--edit"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>

            {confirmDeleteId === q.id ? (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 600 }}>
                  Confirm?
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteClick(q.id)}
                  disabled={isDeleting}
                  className="q-action-btn q-action-btn--confirm-delete"
                >
                  {isDeleting ? '…' : 'Yes, delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(null)}
                  className="q-action-btn q-action-btn--cancel"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleDeleteClick(q.id)}
                className="q-action-btn q-action-btn--delete"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};