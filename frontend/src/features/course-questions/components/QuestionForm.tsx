import { useEffect, useState } from 'react';
import type React from 'react';
import type {
  Question,
  QuestionCreatePayload,
  QuestionDifficulty,
  QuestionType,
} from '../types/courseQuestions.types';

interface QuestionFormProps {
  editingQuestion: Question | null;
  onSubmit: (payload: QuestionCreatePayload) => void;
  onCancel: () => void;
  isPending: boolean;
  serverError: string | null;
}

const DIFFICULTY_OPTIONS: QuestionDifficulty[] = ['easy', 'medium', 'hard'];
const TRUE_FALSE_OPTIONS = ['True', 'False'];
const DEFAULT_MCQ_OPTIONS = ['', '', '', ''];

export const QuestionForm = ({
  editingQuestion,
  onSubmit,
  onCancel,
  isPending,
  serverError,
}: QuestionFormProps) => {
  const [questionType, setQuestionType] = useState<QuestionType>('multiple_choice');
  const [text, setText] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('medium');
  const [options, setOptions] = useState<string[]>([...DEFAULT_MCQ_OPTIONS]);
  const [correctOption, setCorrectOption] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (editingQuestion) {
      setQuestionType(editingQuestion.question_type);
      setText(editingQuestion.text);
      setTopic(editingQuestion.topic);
      setDifficulty(editingQuestion.difficulty);
      setOptions(
        editingQuestion.question_type === 'true_false'
          ? [...TRUE_FALSE_OPTIONS]
          : editingQuestion.options.length >= 2
          ? [...editingQuestion.options]
          : [...DEFAULT_MCQ_OPTIONS]
      );
      setCorrectOption(editingQuestion.correct_option);
    } else {
      resetForm();
    }
  }, [editingQuestion]);

  const resetForm = () => {
    setQuestionType('multiple_choice');
    setText('');
    setTopic('');
    setDifficulty('medium');
    setOptions([...DEFAULT_MCQ_OPTIONS]);
    setCorrectOption('');
    setLocalError(null);
  };

  const handleTypeChange = (newType: QuestionType) => {
    setQuestionType(newType);
    setCorrectOption('');
    if (newType === 'true_false') {
      setOptions([...TRUE_FALSE_OPTIONS]);
    } else {
      setOptions([...DEFAULT_MCQ_OPTIONS]);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
    if (correctOption === options[index]) {
      setCorrectOption('');
    }
  };

  const filledOptions =
    questionType === 'true_false'
      ? TRUE_FALSE_OPTIONS
      : options.filter((o) => o.trim().length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (text.trim().length < 20) {
      setLocalError('Question text must be at least 20 characters.');
      return;
    }
    if (topic.trim().length === 0) {
      setLocalError('Topic is required.');
      return;
    }
    if (filledOptions.length < 2) {
      setLocalError('Please provide at least 2 answer options.');
      return;
    }
    if (!correctOption) {
      setLocalError('Please select the correct answer.');
      return;
    }
    if (!filledOptions.includes(correctOption)) {
      setLocalError('Correct answer must match one of the options exactly.');
      return;
    }

    onSubmit({
      question_type: questionType,
      text: text.trim(),
      topic: topic.trim(),
      difficulty,
      options: filledOptions,
      correct_option: correctOption,
    });
  };

  const isEditing = Boolean(editingQuestion);

  return (
    <div className="q-form-overlay" role="dialog" aria-modal="true" aria-label={isEditing ? 'Edit question' : 'Add question'}>
      <div className="q-form-modal">
        <div className="q-form-modal__header">
          <div>
            <div
              style={{
                display: 'inline-block',
                background: 'var(--color-accent)',
                color: '#fff',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              {isEditing ? 'Edit Question' : 'New Question'}
            </div>
            <h2 style={{ fontSize: '1.1rem', fontFamily: 'Space Grotesk, sans-serif' }}>
              {isEditing ? `Editing Q#${editingQuestion!.id}` : 'Add a Question'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="q-form-modal__close"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="q-form-modal__body">
          <div className="field">
            <label htmlFor="q-type" className="field__label">Question Type</label>
            <select
              id="q-type"
              className="field__input"
              value={questionType}
              onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
              disabled={isEditing}
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="true_false">True / False</option>
            </select>
            {isEditing && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-ink-faint)' }}>
                Type cannot be changed after creation.
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="q-text" className="field__label">Question Text</label>
            <textarea
              id="q-text"
              className="field__input field__textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. What is the output of print(2 + 2)?"
              rows={3}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: text.trim().length >= 20 ? 'var(--color-success)' : 'var(--color-ink-faint)' }}>
                {text.trim().length >= 20 ? '✓ Valid' : `Min 20 chars (${text.trim().length}/20)`}
              </span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="q-topic" className="field__label">Topic</label>
            <input
              id="q-topic"
              className="field__input"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. syntax, loops, data structures"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="q-difficulty" className="field__label">Difficulty</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`q-difficulty-btn q-difficulty-btn--${d}${difficulty === d ? ' q-difficulty-btn--active' : ''}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="field__label">
              {questionType === 'true_false' ? 'Options (fixed)' : 'Answer Options'}
            </label>

            {questionType === 'true_false' ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                {TRUE_FALSE_OPTIONS.map((opt) => (
                  <div
                    key={opt}
                    style={{
                      padding: '10px 16px',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      background: 'var(--color-surface-sunken)',
                      fontWeight: 600,
                      color: 'var(--color-ink-soft)',
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {options.map((opt, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        color: 'var(--color-ink-faint)',
                        minWidth: '20px',
                      }}
                    >
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <input
                      id={`q-option-${idx}`}
                      className="field__input"
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="field">
            <label htmlFor="q-correct" className="field__label">Correct Answer</label>
            {filledOptions.length > 0 ? (
              <select
                id="q-correct"
                className="field__input"
                value={correctOption}
                onChange={(e) => setCorrectOption(e.target.value)}
                required
              >
                <option value="">— select correct option —</option>
                {filledOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-faint)', margin: 0 }}>
                Fill in options above first.
              </p>
            )}
          </div>

          {(localError || serverError) && (
            <p className="auth-card__error" style={{ margin: 0 }}>
              {localError ?? serverError}
            </p>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }}>
            <button
              type="button"
              onClick={onCancel}
              className="dashboard-btn dashboard-btn--sunken"
              style={{ fontSize: '0.8rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="dashboard-btn dashboard-btn--accent"
              style={{ fontSize: '0.8rem' }}
            >
              {isPending
                ? isEditing
                  ? 'SAVING…'
                  : 'ADDING…'
                : isEditing
                ? 'Save Changes'
                : '+ Add Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};