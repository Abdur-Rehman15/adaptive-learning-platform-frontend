import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/features/auth/context/AuthContext';
import { CreateCourseForm } from '@/features/admin-dashboard/components/CreateCourseForm';
import { AddModulesForm } from '@/features/admin-dashboard/components/AddModulesForm';
import type { CourseResponse } from '@/features/admin-dashboard/api/adminCourse.api';

type WizardStep = 'create-course' | 'add-modules';

export const CreateCoursePage = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>('create-course');
  const [createdCourse, setCreatedCourse] = useState<CourseResponse | null>(null);

  const handleCourseCreated = (course: CourseResponse) => {
    setCreatedCourse(course);
    setStep('add-modules');
  };

  const handleFinish = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="app-shell">
      <Navbar role={role ?? 'admin'} />
      <main className="app-shell__content">

        {/* Page Header */}
        <div 
          style={{
            border: '2px solid var(--color-border)',
            borderRadius: '16px',
            padding: '32px',
            background: 'var(--color-surface)',
            boxShadow: '4px 4px 0 var(--color-border)',
            position: 'relative',
            marginBottom: '32px'
          }}
        >
          <div 
            style={{ 
              position: 'absolute', top: '-14px', left: '24px', 
              background: 'var(--color-accent)', color: '#fff',
              border: '2px solid var(--color-border)', borderRadius: '4px',
              padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.05em', textTransform: 'uppercase'
            }}
          >
            Instructor Console
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
                {step === 'create-course' ? 'Create a New Course' : 'Build Your Curriculum'}
              </h1>
              <p style={{ color: 'var(--color-ink-soft)', margin: 0 }}>
                {step === 'create-course'
                  ? 'Define course identity — a compelling title and detailed description that sets learner expectations.'
                  : 'Attach modules with titles, sequential ordering, and content URLs to structure your course delivery.'}
              </p>
            </div>

            {/* Step Indicator */}
            <div 
              style={{ 
                display: 'flex', 
                flexShrink: 0, 
                gap: '8px', 
                alignItems: 'center',
                background: 'var(--color-surface-sunken)',
                border: '2px solid var(--color-border)',
                borderRadius: '10px',
                padding: '10px 16px'
              }}
            >
              <StepDot index={1} label="Course" active={step === 'create-course'} done={step === 'add-modules'} />
              <div style={{ width: '24px', height: '2px', background: step === 'add-modules' ? 'var(--color-accent)' : 'var(--color-border)' }} />
              <StepDot index={2} label="Modules" active={step === 'add-modules'} done={false} />
            </div>
          </div>
        </div>

        {/* Wizard Content */}
        <div 
          style={{
            border: '2px solid var(--color-border)',
            borderRadius: '16px',
            padding: '40px',
            background: 'var(--color-surface)',
            boxShadow: '4px 4px 0 var(--color-border)',
          }}
        >
          {step === 'create-course' && (
            <CreateCourseForm onSuccess={handleCourseCreated} />
          )}

          {step === 'add-modules' && createdCourse && (
            <AddModulesForm course={createdCourse} onFinish={handleFinish} />
          )}
        </div>

      </main>
      <Footer role={role ?? 'admin'} />
    </div>
  );
};

interface StepDotProps {
  index: number;
  label: string;
  active: boolean;
  done: boolean;
}

const StepDot = ({ index, label, active, done }: StepDotProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
    <div 
      style={{ 
        width: '32px', height: '32px', 
        borderRadius: '50%', 
        border: `2px solid ${active || done ? 'var(--color-accent)' : 'var(--color-border)'}`,
        background: done ? 'var(--color-accent)' : active ? 'rgba(225,29,72,0.1)' : 'var(--color-surface)',
        color: done ? '#fff' : active ? 'var(--color-accent)' : 'var(--color-ink-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: '0.8rem',
        fontFamily: 'JetBrains Mono, monospace',
        transition: 'all 0.2s ease'
      }}
    >
      {done ? '✓' : index}
    </div>
    <span style={{ 
      fontSize: '0.65rem', fontWeight: 700, 
      textTransform: 'uppercase', letterSpacing: '0.05em',
      color: active ? 'var(--color-accent)' : 'var(--color-ink-faint)'
    }}>
      {label}
    </span>
  </div>
);
