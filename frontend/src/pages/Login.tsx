import { LoginForm } from '@/features/auth/components/LoginForm';

export const LoginPage = () => (
  <div className="auth-shell">
    <section className="auth-card">
      <div className="auth-card__eyebrow">SkillForge / Secure gateway</div>
      <h1 className="auth-card__title">Access the learning cockpit.</h1>
      <p className="auth-card__intro">
        Sign in to continue your course flow, quiz progress, and mastery view.
      </p>
      <LoginForm />
    </section>
  </div>
);