import { RegisterForm } from '@/features/auth/components/RegisterForm';

export const RegisterPage = () => (
  <div className="auth-shell">
    <section className="auth-card">
      <div className="auth-card__eyebrow">SkillForge / Access Point</div>
      <h1 className="auth-card__title">Create your workspace.</h1>
      <p className="auth-card__intro">
        Register to construct courses as an instructor or build mastery as a learner.
      </p>
      <RegisterForm />
    </section>
  </div>
);
