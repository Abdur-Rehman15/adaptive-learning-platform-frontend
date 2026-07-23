import { useCallback, useEffect, useMemo, useState } from 'react';
import type React from 'react';
import type { ModuleResponse } from '../api/adminCourse.api';
import { useCreateModule, useCourseModules } from '../hooks/useCreateCourse';
import { useReorderModules, useUpdateModule, useDeleteModule } from '../hooks/useManageCourse';

interface CourseModulesEditorProps {
  courseId: number;
}

const sortByOrder = (items: ModuleResponse[]) =>
  [...items].sort((a, b) => a.order - b.order);

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const moduleIdsMatchOrder = (a: ModuleResponse[], b: ModuleResponse[]) =>
  a.length === b.length && a.every((mod, index) => mod.id === b[index]?.id);

export const CourseModulesEditor = ({ courseId }: CourseModulesEditorProps) => {
  const { data: serverModules = [], isLoading } = useCourseModules(courseId);
  const { mutate: addModule, isPending: isAdding } = useCreateModule(courseId);
  const { mutate: updateModule, isPending: isUpdatingModule } = useUpdateModule(courseId);
  const { mutate: saveOrder, isPending: isSavingOrder, error: reorderError } =
    useReorderModules(courseId);
  const { mutate: removeModule, isPending: isDeletingModule } = useDeleteModule(courseId);

  const [orderedModules, setOrderedModules] = useState<ModuleResponse[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [confirmDeleteModuleId, setConfirmDeleteModuleId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [orderSaveSuccess, setOrderSaveSuccess] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const sortedServer = useMemo(() => sortByOrder(serverModules), [serverModules]);

  useEffect(() => {
    setOrderedModules((current) => {
      if (moduleIdsMatchOrder(current, sortedServer)) {
        return current;
      }
      return sortedServer;
    });
  }, [sortedServer]);

  const orderDirty = useMemo(
    () => !moduleIdsMatchOrder(orderedModules, sortedServer),
    [orderedModules, sortedServer]
  );

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) {
      return;
    }

    setOrderedModules((items) => {
      const next = [...items];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const handleSaveOrder = () => {
    setLocalError(null);
    setOrderSaveSuccess(false);
    saveOrder(
      orderedModules.map((mod, index) => ({ module_id: mod.id, order: index + 1 })),
      {
        onSuccess: () => setOrderSaveSuccess(true),
        onError: (err) => setLocalError(err.message),
      }
    );
  };

  const handleDeleteModule = (moduleId: number) => {
    if (confirmDeleteModuleId !== moduleId) {
      setConfirmDeleteModuleId(moduleId);
      setLocalError(null);
      return;
    }

    setLocalError(null);
    removeModule(moduleId, {
      onSuccess: () => {
        setConfirmDeleteModuleId(null);
        if (editingModuleId === moduleId) {
          cancelEdit();
        }
      },
      onError: (err) => setLocalError(err.message),
    });
  };

  const openEdit = (mod: ModuleResponse) => {
    setEditingModuleId(mod.id);
    setEditTitle(mod.title);
    setEditUrl(mod.content_url);
    setLocalError(null);
  };

  const cancelEdit = () => {
    setEditingModuleId(null);
    setEditTitle('');
    setEditUrl('');
    setLocalError(null);
  };

  const handleSaveModule = (moduleId: number) => {
    setLocalError(null);
    const title = editTitle.trim();
    if (title.length < 10) {
      setLocalError('Module title must be at least 10 characters.');
      return;
    }
    if (!isValidUrl(editUrl)) {
      setLocalError('Content URL must be a valid http or https link.');
      return;
    }

    updateModule(
      {
        moduleId,
        payload: { title, content_url: editUrl.trim() },
      },
      {
        onSuccess: () => cancelEdit(),
        onError: (err) => setLocalError(err.message),
      }
    );
  };

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const title = newTitle.trim();
    if (title.length < 10) {
      setLocalError('Module title must be at least 10 characters.');
      return;
    }
    if (!isValidUrl(newUrl)) {
      setLocalError('Content URL must be a valid http or https link.');
      return;
    }

    const nextOrder =
      orderedModules.length > 0
        ? Math.max(...orderedModules.map((m) => m.order)) + 1
        : 1;

    addModule(
      { title, order: nextOrder, content_url: newUrl.trim() },
      {
        onSuccess: () => {
          setNewTitle('');
          setNewUrl('');
        },
        onError: (err) => setLocalError(err.message),
      }
    );
  };

  const resetOrder = useCallback(() => {
    setOrderedModules(sortedServer);
    setOrderSaveSuccess(false);
  }, [sortedServer]);

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel__header">
        <div>
          <p className="dashboard-panel__eyebrow" style={{ color: 'var(--color-accent)' }}>
            Modules
          </p>
          <h2 className="dashboard-panel__title">Manage Course Modules</h2>
        </div>
        <p className="dashboard-panel__description">
          Drag rows to reorder, then save. Edit titles and content links inline.
        </p>
      </div>

      {isLoading ? (
        <p
          style={{
            marginTop: '20px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.8rem',
            color: 'var(--color-ink-faint)',
          }}
        >
          SYNCING MODULES…
        </p>
      ) : (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orderedModules.length === 0 ? (
            <p className="dashboard-panel__empty">No modules yet. Add your first module below.</p>
          ) : (
            <div className="module-editor-list">
              {orderedModules.map((mod, index) => {
                const isEditing = editingModuleId === mod.id;
                const isDragging = dragIndex === index;

                return (
                  <div
                    key={mod.id}
                    className={`module-editor-row${isDragging ? ' module-editor-row--dragging' : ''}`}
                    draggable={!isEditing}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="module-editor-row__main">
                      <span
                        className="module-editor-row__handle"
                        title="Drag to reorder"
                        aria-hidden
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                          <circle cx="4" cy="3" r="1.5" />
                          <circle cx="10" cy="3" r="1.5" />
                          <circle cx="4" cy="7" r="1.5" />
                          <circle cx="10" cy="7" r="1.5" />
                          <circle cx="4" cy="11" r="1.5" />
                          <circle cx="10" cy="11" r="1.5" />
                        </svg>
                      </span>
                      <span className="module-editor-row__order">#{index + 1}</span>
                      <div className="module-editor-row__body">
                        {isEditing ? (
                          <div className="module-editor-row__edit-form">
                            <input
                              className="field__input"
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="Module title"
                            />
                            <input
                              className="field__input"
                              type="url"
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                              placeholder="https://…"
                            />
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                className="dashboard-btn dashboard-btn--accent"
                                style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                                disabled={isUpdatingModule}
                                onClick={() => handleSaveModule(mod.id)}
                              >
                                {isUpdatingModule ? 'SAVING…' : 'Save Module'}
                              </button>
                              <button
                                type="button"
                                className="dashboard-btn dashboard-btn--sunken"
                                style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                                onClick={cancelEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="module-editor-row__title">{mod.title}</span>
                            <a
                              href={mod.content_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="module-editor-row__url"
                            >
                              {mod.content_url}
                            </a>
                          </>
                        )}
                      </div>
                      {!isEditing && (
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          <button
                            type="button"
                            className="dashboard-btn dashboard-btn--sunken"
                            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                            onClick={() => openEdit(mod)}
                          >
                            Edit
                          </button>
                          {confirmDeleteModuleId === mod.id ? (
                            <>
                              <button
                                type="button"
                                className="dashboard-btn dashboard-btn--danger"
                                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                                disabled={isDeletingModule}
                                onClick={() => handleDeleteModule(mod.id)}
                              >
                                {isDeletingModule ? '…' : 'Confirm'}
                              </button>
                              <button
                                type="button"
                                className="dashboard-btn dashboard-btn--sunken"
                                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                                disabled={isDeletingModule}
                                onClick={() => setConfirmDeleteModuleId(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              className="dashboard-btn dashboard-btn--danger"
                              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                              onClick={() => handleDeleteModule(mod.id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {orderSaveSuccess && !orderDirty && (
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-success)' }}>
              Module order saved successfully.
            </p>
          )}

          {orderDirty && (
            <div className="module-editor-order-bar">
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-ink-soft)' }}>
                Module order changed — save to apply.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="dashboard-btn dashboard-btn--primary"
                  disabled={isSavingOrder}
                  onClick={handleSaveOrder}
                >
                  {isSavingOrder ? 'SAVING ORDER…' : 'Save Module Order'}
                </button>
                <button
                  type="button"
                  className="dashboard-btn dashboard-btn--sunken"
                  disabled={isSavingOrder}
                  onClick={resetOrder}
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {(localError || reorderError) && (
            <p className="auth-card__error" style={{ margin: 0 }}>
              {localError ?? reorderError?.message}
            </p>
          )}

          <div
            style={{
              borderTop: '2px solid var(--color-border)',
              paddingTop: '20px',
            }}
          >
            <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1rem', marginBottom: '16px' }}>
              Add Module
            </h3>
            <form
              onSubmit={handleAddModule}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'end' }}
              className="module-editor-add-form admin-form-group"
            >
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor="new-module-title" className="field__label">
                  Title
                </label>
                <input
                  id="new-module-title"
                  className="field__input"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Module title (min 10 chars)"
                />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor="new-module-url" className="field__label">
                  Content URL
                </label>
                <input
                  id="new-module-url"
                  className="field__input"
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://…"
                />
              </div>
              <button
                type="submit"
                disabled={isAdding}
                className="dashboard-btn dashboard-btn--accent"
                style={{ height: 'fit-content' }}
              >
                {isAdding ? 'ADDING…' : '+ Add'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
