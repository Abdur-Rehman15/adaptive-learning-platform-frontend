import { useState } from 'react';
import type React from 'react';
import type { CourseResponse } from '../api/adminCourse.api';
import { useCreateCourse } from '../hooks/useCreateCourse';

interface CreateCourseFormProps {
  onSuccess: (course: CourseResponse) => void;
}

export const CreateCourseForm = ({ onSuccess }: CreateCourseFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { mutate: create, isPending, error } = useCreateCourse();

  const titleLen = title.trim().length;
  const descLen = description.trim().length;
  const titleValid = titleLen >= 10;
  const descValid = descLen >= 200 && descLen <= 1000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!titleValid) {
      setLocalError('Course title must be at least 10 characters.');
      return;
    }
    if (descLen < 200) {
      setLocalError('Description must be at least 200 characters.');
      return;
    }
    if (descLen > 1000) {
      setLocalError('Description must not exceed 1000 characters.');
      return;
    }

    create({ title: title.trim(), description: description.trim() }, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="admin-form-group field">
        <label htmlFor="course-title" className="field__label">Course Title</label>
        <input
          id="course-title"
          className="field__input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Introduction to Python Programming"
          required
        />
        <div className="admin-form-helper-row">
          <span className={`admin-form-helper${titleValid ? ' admin-form-helper--valid' : ''}`}>
            {titleValid ? '✓ Title length valid' : 'Minimum 10 characters required'}
          </span>
          <span className="admin-form-helper" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {titleLen} chars
          </span>
        </div>
      </div>

      <div className="admin-form-group field">
        <label htmlFor="course-description" className="field__label">Course Description</label>
        <textarea
          id="course-description"
          className="field__input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide a detailed overview of the course objectives, topics covered, target audience, and outcomes..."
          rows={8}
          required
          style={{ resize: 'vertical', lineHeight: 1.6 }}
        />
        <div className="admin-form-helper-row">
          <span
            className={`admin-form-helper${
              descValid
                ? ' admin-form-helper--valid'
                : descLen > 1000
                  ? ' admin-form-helper--error'
                  : ''
            }`}
          >
            {descValid
              ? '✓ Description length valid'
              : descLen > 1000
                ? 'Description exceeds 1000 characters'
                : `${200 - descLen} more characters needed`}
          </span>
          <span
            className={`admin-form-helper${descLen > 1000 ? ' admin-form-helper--error' : ''}`}
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {descLen} / 1000
          </span>
        </div>
      </div>

      {(localError || error) && (
        <p className="auth-card__error" style={{ margin: 0 }}>
          {localError ?? error?.message}
        </p>
      )}

      <div className="admin-form-actions">
        <button
          type="submit"
          disabled={isPending}
          className="dashboard-btn dashboard-btn--accent"
          style={{ padding: '14px 32px', fontSize: '0.9rem' }}
        >
          {isPending ? 'CREATING COURSE…' : 'Create Course →'}
        </button>
      </div>
    </form>
  );
};
