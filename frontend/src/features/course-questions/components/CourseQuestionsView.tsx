import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useCourseModules } from '@/features/admin-dashboard/hooks/useCreateCourse';
import type { CourseResponse, ModuleResponse } from '@/features/admin-dashboard/api/adminCourse.api';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { QuestionCourseCard } from './QuestionCourseCard';
import { QuestionModuleList } from './QuestionModuleList';
import { QuestionForm } from './QuestionForm';
import { QuestionList } from './QuestionList';
import {
  useQuestionCourses,
  useModuleQuestions,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from '../hooks/useCourseQuestions';
import type { Question, QuestionCreatePayload } from '../types/courseQuestions.types';

const ModuleQuestionsPanel = ({
  courseId,
  onBack,
}: {
  courseId: number;
  onBack: () => void;
}) => {
  const [selectedModule, setSelectedModule] = useState<ModuleResponse | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const { data: modules = [], isLoading: loadingModules } = useCourseModules(courseId);

  const { data: questions = [], isLoading: loadingQuestions } = useModuleQuestions(
    selectedModule?.id ?? null
  );

  const { mutate: doCreate, isPending: isCreating } = useCreateQuestion(
    selectedModule?.id ?? 0
  );
  const { mutate: doUpdate, isPending: isUpdating } = useUpdateQuestion(
    selectedModule?.id ?? 0
  );
  const { mutate: doDelete, isPending: isDeleting } = useDeleteQuestion(
    selectedModule?.id ?? 0
  );

  const handleOpenCreate = () => {
    setEditingQuestion(null);
    setMutationError(null);
    setShowForm(true);
  };

  const handleOpenEdit = (question: Question) => {
    setEditingQuestion(question);
    setMutationError(null);
    setShowForm(true);
  };

  const handleFormSubmit = (payload: QuestionCreatePayload) => {
    setMutationError(null);

    if (editingQuestion) {
      doUpdate(
        { questionId: editingQuestion.id, payload },
        {
          onSuccess: () => setShowForm(false),
          onError: (err) => setMutationError(err.message),
        }
      );
    } else {
      doCreate(payload, {
        onSuccess: () => setShowForm(false),
        onError: (err) => setMutationError(err.message),
      });
    }
  };

  const handleDelete = (questionId: number) => {
    doDelete(questionId);
  };

  const handleModuleSelect = (mod: ModuleResponse) => {
    setSelectedModule(mod);
    setShowForm(false);
    setEditingQuestion(null);
    setMutationError(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <div className="q-breadcrumb">
        <button type="button" onClick={onBack} className="q-breadcrumb__back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          All Courses
        </button>
        <span className="q-breadcrumb__sep">›</span>
        <span className="q-breadcrumb__current">
          Course #{courseId} — Modules
        </span>
        {selectedModule && (
          <>
            <span className="q-breadcrumb__sep">›</span>
            <span className="q-breadcrumb__current">{selectedModule.title}</span>
          </>
        )}
      </div>

      <div className="q-module-questions-layout">
        <div className="q-module-col">
          <div className="q-col-header">
            <p className="q-col-header__eyebrow">Course Modules</p>
            <h2 className="q-col-header__title">Select a Module</h2>
          </div>
          <QuestionModuleList
            modules={modules}
            selectedModuleId={selectedModule?.id ?? null}
            isLoading={loadingModules}
            onSelectModule={handleModuleSelect}
          />
        </div>

        <div className="q-questions-col">
          {selectedModule ? (
            <>
              <div className="q-col-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <p className="q-col-header__eyebrow">Module #{selectedModule.order}</p>
                  <h2 className="q-col-header__title">{selectedModule.title}</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-soft)', marginTop: '4px' }}>
                    {questions.length} question{questions.length !== 1 ? 's' : ''} in this module
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="dashboard-btn dashboard-btn--accent"
                  style={{ fontSize: '0.8rem', flexShrink: 0 }}
                >
                  + Add Question
                </button>
              </div>

              <QuestionList
                questions={questions}
                isLoading={loadingQuestions}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            </>
          ) : (
            <div className="q-select-prompt">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--color-ink-faint)', marginBottom: '12px' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="9" x2="15" y2="9" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="9" y1="15" x2="12" y2="15" />
              </svg>
              <p style={{ fontWeight: 700, margin: '0 0 4px' }}>No module selected</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-soft)', margin: 0 }}>
                Select a module from the list to manage its questions.
              </p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <QuestionForm
          editingQuestion={editingQuestion}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setMutationError(null); }}
          isPending={isCreating || isUpdating}
          serverError={mutationError}
        />
      )}
    </div>
  );
};

export const CourseQuestionsView = () => {
  const { user, role, isHydrating, clearSession } = useAuth();
  const navigate = useNavigate();
  const questionCoursesQuery = useQuestionCourses();
  const courses: CourseResponse[] = questionCoursesQuery.data ?? [];
  const isLoading = questionCoursesQuery.isLoading;
  const error = questionCoursesQuery.error;
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null);

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  if (isHydrating) {
    return (
      <div className="auth-shell">
        <div className="auth-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
          <div className="auth-card__eyebrow">System Control</div>
          <h1 className="auth-card__title" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
            Securing Connection
          </h1>
          <p className="auth-card__intro" style={{ margin: 0 }}>
            Verifying cryptographic token and active session parameters.
          </p>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-primary)', marginTop: '12px', letterSpacing: '0.05em' }}>
            VERIFYING AUTHORIZATION…
          </div>
        </div>
      </div>
    );
  }

  if (!user || !role) {
    return null;
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px', gap: '12px' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', color: 'var(--color-ink-faint)' }}>
          SYNCING COURSES…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <p className="auth-card__error">Failed to load courses: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar role={role} />
      <main className="app-shell__content">
        {selectedCourse ? (
          <ModuleQuestionsPanel
            courseId={selectedCourse.id}
            onBack={() => setSelectedCourse(null)}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div
              style={{
                border: '2px solid var(--color-border)',
                borderRadius: '16px',
                padding: '28px 32px',
                background: 'var(--color-surface)',
                boxShadow: '4px 4px 0px 0px var(--color-border)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '24px',
                  background: 'var(--color-accent)',
                  color: '#ffffff',
                  border: '2px solid var(--color-border)',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Question Bank
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <h1 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>Manage Questions</h1>
                  <p style={{ color: 'var(--color-ink-soft)', margin: 0 }}>
                    Select a course to browse its modules and manage quiz questions.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleLogout}
                    className="dashboard-btn dashboard-btn--sunken"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>

            {courses.length === 0 ? (
              <section className="dashboard-empty">
                <p className="dashboard-empty__eyebrow">Question Bank Empty</p>
                <h2 className="dashboard-empty__title">No courses found.</h2>
                <p className="dashboard-empty__text">
                  Create a course first, then add modules and questions to build your quiz bank.
                </p>
              </section>
            ) : (
              <div className="q-course-grid">
                {courses.map((course: CourseResponse) => (
                  <QuestionCourseCard
                    key={course.id}
                    course={course}
                    isSelected={selectedCourse === course}
                    onClick={() => setSelectedCourse(course)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer role={role} />
    </div>
  );
};