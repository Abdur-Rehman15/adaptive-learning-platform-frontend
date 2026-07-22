import { useState } from 'react';
import type { Question } from '@/features/course-questions/types/courseQuestions.types';

interface QuizViewProps {
  currentQuestion: Question;
  questionNumber: number;
  isSubmitting: boolean;
  canFinish: boolean;
  onAnswer: (selectedOption: string) => Promise<void> | void;
  onFinish: () => Promise<void> | void;
}

export const QuizView = ({
  currentQuestion,
  questionNumber,
  isSubmitting,
  canFinish,
  onAnswer,
  onFinish,
}: QuizViewProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const handleSelect = (option: string) => {
    if (isAnswering || isSubmitting) return;
    setSelected(option);
  };

  const handleSubmitAnswer = async () => {
    if (!selected || isAnswering) return;
    setIsAnswering(true);
    await onAnswer(selected);
    setSelected(null);
    setIsAnswering(false);
  };

  const difficultyColor = {
    easy: 'var(--color-success)',
    medium: 'var(--color-warning)',
    hard: 'var(--color-danger)',
  }[currentQuestion.difficulty];

  const isBusy = isAnswering || isSubmitting;

  return (
    <div className="quiz-view">
      <div className="quiz-view__header">
        <div className="quiz-view__meta">
          <span className="quiz-view__q-number">Q {questionNumber}</span>
          <span className="quiz-view__topic">{currentQuestion.topic}</span>
          <span
            className="quiz-view__difficulty"
            style={{ color: difficultyColor, borderColor: difficultyColor }}
          >
            {currentQuestion.difficulty.toUpperCase()}
          </span>
        </div>
        <div className="quiz-view__type-badge">
          {currentQuestion.question_type === 'multiple_choice'
            ? 'MCQ'
            : 'True / False'}
        </div>
      </div>

      <div className="quiz-card">
        <p className="quiz-card__text">{currentQuestion.text}</p>
      </div>

      <div className="quiz-options">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selected === option;
          const optionLabel = String.fromCharCode(65 + idx);

          return (
            <button
              key={option}
              id={`quiz-option-${currentQuestion.id}-${idx}`}
              type="button"
              className={`quiz-option ${isSelected ? 'quiz-option--selected' : ''}`}
              onClick={() => handleSelect(option)}
              disabled={isBusy}
              aria-pressed={isSelected}
            >
              <span className="quiz-option__label">{optionLabel}</span>
              <span className="quiz-option__text">{option}</span>
              {isSelected && <span className="quiz-option__check">✓</span>}
            </button>
          );
        })}
      </div>

      <div className="quiz-view__actions">
        {canFinish ? (
          <button
            id="quiz-submit-final-btn"
            type="button"
            className="dashboard-btn dashboard-btn--primary quiz-view__submit-btn"
            onClick={() => void onFinish()}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="quiz-view__spinner" />
            ) : (
              '⬆ Submit Quiz'
            )}
          </button>
        ) : (
          <button
            id="quiz-next-btn"
            type="button"
            className="dashboard-btn dashboard-btn--primary quiz-view__submit-btn"
            onClick={() => void handleSubmitAnswer()}
            disabled={!selected || isBusy}
          >
            {isAnswering ? (
              <span className="quiz-view__spinner" />
            ) : (
              'Submit Answer →'
            )}
          </button>
        )}
      </div>

      {!selected && !canFinish && (
        <p className="quiz-view__hint">Select an option to continue.</p>
      )}
    </div>
  );
};
