import { useState } from 'react';
import type React from 'react';
import { useCreateModule, useCourseModules } from '../hooks/useCreateCourse';
import type { CourseResponse } from '../api/adminCourse.api';

interface AddModulesFormProps {
  course: CourseResponse;
  onFinish: () => void;
}

export const AddModulesForm = ({ course, onFinish }: AddModulesFormProps) => {
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const { mutate: addModule, isPending, error } = useCreateModule(course.id);
  const { data: modules = [], isLoading: loadingModules } = useCourseModules(course.id);

  const titleLen = title.trim().length;
  const titleValid = titleLen >= 10;

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url.trim());
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!titleValid) {
      setLocalError('Module title must be at least 10 characters.');
      return;
    }
    const orderNum = parseInt(order, 10);
    if (!orderNum || orderNum < 1) {
      setLocalError('Order must be a positive integer (1 or more).');
      return;
    }
    if (!isValidUrl(contentUrl)) {
      setLocalError('Content URL must be a valid http or https link.');
      return;
    }

    addModule(
      { title: title.trim(), order: orderNum, content_url: contentUrl.trim() },
      {
        onSuccess: () => {
          setTitle('');
          setOrder('');
          setContentUrl('');
          setLocalError(null);
        },
      }
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Course Context Banner */}
      <div 
        style={{
          border: '2px solid var(--color-accent)',
          borderRadius: '12px',
          padding: '20px 24px',
          background: 'rgba(225,29,72,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div 
          style={{ 
            background: 'var(--color-accent)', 
            color: '#fff', 
            borderRadius: '6px', 
            padding: '4px 10px',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            flexShrink: 0
          }}
        >
          Course ID {course.id}
        </div>
        <div>
          <p style={{ fontWeight: 700, margin: 0 }}>{course.title}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-soft)', margin: 0, marginTop: '2px' }}>
            Created by {course.created_by}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
        {/* Add Module Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', marginBottom: '16px' }}>
            Add a Module
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Module Title */}
            <div className="field">
              <label htmlFor="module-title" className="field__label">Module Title</label>
              <input
                id="module-title"
                className="field__input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Introduction to Variables"
                required
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: titleValid ? 'var(--color-success)' : 'var(--color-ink-faint)' }}>
                  {titleValid ? '✓ Valid title' : 'Min 10 characters'}
                </span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--color-ink-soft)' }}>
                  {titleLen}
                </span>
              </div>
            </div>

            {/* Module Order */}
            <div className="field">
              <label htmlFor="module-order" className="field__label">Display Order</label>
              <input
                id="module-order"
                className="field__input"
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="e.g. 1"
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-ink-faint)', marginTop: '4px' }}>
                Unique sequential position within this course
              </span>
            </div>

            {/* Content URL */}
            <div className="field">
              <label htmlFor="module-url" className="field__label">Content URL</label>
              <input
                id="module-url"
                className="field__input"
                type="url"
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                placeholder="https://example.com/lesson-video"
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-ink-faint)', marginTop: '4px' }}>
                Must be a valid https:// URL to learning material
              </span>
            </div>

            {(localError || error) && (
              <p className="auth-card__error" style={{ margin: 0 }}>
                {localError ?? error?.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="dashboard-btn dashboard-btn--accent"
              style={{ fontSize: '0.85rem' }}
            >
              {isPending ? 'ADDING MODULE…' : '+ Add Module'}
            </button>
          </form>
        </div>

        {/* Module List */}
        <div>
          <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', marginBottom: '16px' }}>
            Modules Added
            <span 
              style={{ 
                marginLeft: '10px', 
                fontFamily: 'JetBrains Mono, monospace', 
                fontSize: '0.8rem', 
                color: 'var(--color-accent)',
                fontWeight: 600
              }}
            >
              [{modules.length}]
            </span>
          </h3>

          {loadingModules ? (
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--color-ink-faint)' }}>
              SYNCING MODULES…
            </p>
          ) : modules.length === 0 ? (
            <div 
              style={{
                border: '2px dashed var(--color-border)',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                color: 'var(--color-ink-faint)'
              }}
            >
              <p style={{ fontSize: '0.875rem' }}>No modules yet.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Add the first module for this course.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[...modules]
                .sort((a, b) => a.order - b.order)
                .map((mod) => (
                  <div
                    key={mod.id}
                    style={{
                      border: '2px solid var(--color-border)',
                      borderRadius: '10px',
                      padding: '14px 16px',
                      background: 'var(--color-surface)',
                      boxShadow: '2px 2px 0 var(--color-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span 
                        style={{ 
                          fontFamily: 'JetBrains Mono, monospace', 
                          fontWeight: 700, 
                          color: 'var(--color-accent)',
                          fontSize: '0.8rem',
                          background: 'rgba(225,29,72,0.08)',
                          border: '1px solid var(--color-accent)',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          flexShrink: 0
                        }}
                      >
                        #{mod.order}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{mod.title}</span>
                    </div>
                    <a
                      href={mod.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--color-primary)', 
                        textDecoration: 'none',
                        fontFamily: 'JetBrains Mono, monospace',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {mod.content_url}
                    </a>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Finish Button */}
      <div 
        style={{ 
          borderTop: '2px solid var(--color-border)', 
          paddingTop: '24px', 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <p style={{ color: 'var(--color-ink-soft)', fontSize: '0.875rem', margin: 0 }}>
          You can always add more modules from the dashboard later.
        </p>
        <button
          type="button"
          onClick={onFinish}
          className="dashboard-btn dashboard-btn--primary"
        >
          Go to Dashboard →
        </button>
      </div>
    </div>
  );
};
