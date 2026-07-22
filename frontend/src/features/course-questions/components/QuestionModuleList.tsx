import type { ModuleResponse } from '@/features/admin-dashboard/api/adminCourse.api';

interface QuestionModuleListProps {
  modules: ModuleResponse[];
  selectedModuleId: number | null;
  isLoading: boolean;
  onSelectModule: (module: ModuleResponse) => void;
}

export const QuestionModuleList = ({
  modules,
  selectedModuleId,
  isLoading,
  onSelectModule,
}: QuestionModuleListProps) => {
  if (isLoading) {
    return (
      <div className="q-module-list__loading">
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--color-ink-faint)' }}>
          SYNCING MODULES…
        </span>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="q-module-list__empty">
        <p style={{ fontWeight: 700, marginBottom: '4px' }}>No modules yet</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-soft)' }}>
          Add modules to this course first from the Create Course page.
        </p>
      </div>
    );
  }

  const sorted = [...modules].sort((a, b) => a.order - b.order);

  return (
    <div className="q-module-list">
      {sorted.map((mod) => {
        const isSelected = selectedModuleId === mod.id;
        return (
          <button
            key={mod.id}
            type="button"
            onClick={() => onSelectModule(mod)}
            aria-pressed={isSelected}
            className={`q-module-item${isSelected ? ' q-module-item--selected' : ''}`}
          >
            <span className="q-module-item__order">#{mod.order}</span>
            <span className="q-module-item__title">{mod.title}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: 'auto', flexShrink: 0, color: isSelected ? 'var(--color-accent)' : 'var(--color-ink-faint)' }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};