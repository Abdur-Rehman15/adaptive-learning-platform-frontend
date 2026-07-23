import { useEffect, useState } from 'react';
import type React from 'react';
import type { InstructorCourse } from '../types/adminDashboard.types';
import { useDeleteCourse, useUpdateCourse } from '../hooks/useManageCourse';

interface EditCoursePanelProps {
  course: InstructorCourse;
  onCourseDeleted?: () => void;
}

export const EditCoursePanel = ({ course, onCourseDeleted }: EditCoursePanelProps) => {
  const courseId = Number(course.id);
  const [isEditing, setIsEditing] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [localError, setLocalError] = useState<string | null>(null);

  const { mutate: saveCourse, isPending, error, isSuccess, reset } = useUpdateCourse(
    Number.isFinite(courseId) ? courseId : null
  );
  const { mutate: removeCourse, isPending: isDeleting, error: deleteError } = useDeleteCourse();

  useEffect(() => {
    if (!isEditing) {
      setTitle(course.title);
      setDescription(course.description);
    }
    setConfirmDelete(false);
  }, [course.title, course.description, course.id, isEditing]);

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

    saveCourse(
      { title: title.trim(), description: description.trim() },
      {
        onSuccess: () => {
          setIsEditing(false);
          reset();
        },
        onError: (err) => setLocalError(err.message),
      }
    );
  };

  const handleCancel = () => {
    setTitle(course.title);
    setDescription(course.description);
    setLocalError(null);
    setIsEditing(false);
    reset();
  };

  const handleDeleteCourse = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setLocalError(null);
      return;
    }

    if (!Number.isFinite(courseId)) {
      return;
    }

    setLocalError(null);
    removeCourse(courseId, {
      onSuccess: () => {
        setConfirmDelete(false);
        onCourseDeleted?.();
      },
      onError: (err) => setLocalError(err.message),
    });
  };

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="dashboard-panel__eyebrow" style={{ color: 'var(--color-accent)' }}>
            Curriculum
          </p>
          <h2 className="dashboard-panel__title">Course Details</h2>
        </div>
        {!isEditing && (
          <button
            type="button"
            className="dashboard-btn dashboard-btn--sunken"
            onClick={() => setIsEditing(true)}
            style={{ flexShrink: 0 }}
          >
            Edit Course
          </button>
        )}
      </div>

      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}
        >
          <div className="admin-form-group field">
            <label htmlFor="edit-course-title" className="field__label">
              Course Title
            </label>
            <input
              id="edit-course-title"
              className="field__input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <span className={`admin-form-helper${titleValid ? ' admin-form-helper--valid' : ''}`}>
              {titleValid ? '✓ Title length valid' : 'Minimum 10 characters'}
            </span>
          </div>

          <div className="admin-form-group field">
            <label htmlFor="edit-course-description" className="field__label">
              Course Description
            </label>
            <textarea
              id="edit-course-description"
              className="field__input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              required
              style={{ resize: 'vertical', lineHeight: 1.6 }}
            />
            <span className={`admin-form-helper${descValid ? ' admin-form-helper--valid' : ''}`}>
              {descValid
                ? '✓ Description length valid'
                : `${Math.max(0, 200 - descLen)} more characters needed (max 1000)`}
            </span>
          </div>

          {(localError || error) && (
            <p className="auth-card__error" style={{ margin: 0 }}>
              {localError ?? error?.message}
            </p>
          )}

          {isSuccess && !error && !localError && (
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-success)' }}>
              Course updated successfully.
            </p>
          )}

          <div className="admin-form-actions">
            <button
              type="submit"
              disabled={isPending}
              className="dashboard-btn dashboard-btn--accent"
            >
              {isPending ? 'SAVING…' : 'Save Course'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="dashboard-btn dashboard-btn--sunken"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--color-ink-soft)',
                marginBottom: '6px',
              }}
            >
              Title
            </p>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem' }}>{course.title}</p>
          </div>
          <div>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--color-ink-soft)',
                marginBottom: '6px',
              }}
            >
              Description
            </p>
            <p style={{ margin: 0, color: 'var(--color-ink-soft)', lineHeight: 1.6, fontSize: '0.9rem' }}>
              {course.description || 'No description provided.'}
            </p>
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '2px solid var(--color-border)',
        }}
      >
        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--color-ink-soft)',
            marginBottom: '10px',
          }}
        >
          Danger Zone
        </p>
        <p style={{ margin: '0 0 12px', fontSize: '0.875rem', color: 'var(--color-ink-soft)' }}>
          Deleting this course removes all modules, questions, and learner progress tied to it.
        </p>
        {confirmDelete ? (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Delete this course permanently?</span>
            <button
              type="button"
              className="dashboard-btn dashboard-btn--danger"
              disabled={isDeleting}
              onClick={handleDeleteCourse}
            >
              {isDeleting ? 'DELETING…' : 'Yes, Delete Course'}
            </button>
            <button
              type="button"
              className="dashboard-btn dashboard-btn--sunken"
              disabled={isDeleting}
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="dashboard-btn dashboard-btn--danger"
            disabled={isDeleting}
            onClick={handleDeleteCourse}
          >
            Delete Course
          </button>
        )}
        {(localError || deleteError) && !isEditing && (
          <p className="auth-card__error" style={{ margin: '12px 0 0' }}>
            {localError ?? deleteError?.message}
          </p>
        )}
      </div>
    </section>
  );
};
