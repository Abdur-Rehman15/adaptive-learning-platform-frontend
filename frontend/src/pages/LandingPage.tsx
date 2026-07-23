import { useState, useEffect, useRef } from 'react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest, getCurrentUserRequest, registerRequest } from '@/features/auth/api/auth.api';
import { useAuth } from '@/features/auth/context/AuthContext';
import heroImage from '@/assets/landing_hero_bg.png';
import statsImage from '@/assets/landing_stats_visual.png';

/* ─── Types ─────────────────────────────────────────────── */
type ModalMode = 'signin' | 'signup' | null;

/* ─── Animated counter hook ─────────────────────────────── */
function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ─── Landing Page ───────────────────────────────────────── */
export const LandingPage = () => {
  const [modal, setModal] = useState<ModalMode>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setSession } = useAuth();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains('lp-modal-overlay')) {
      setModal(null);
    }
  };

  return (
    <div className="lp-root">
      {/* ── Navbar ────────────────────────────────────── */}
      <nav className="lp-nav">
        <div className="lp-nav__logo">
          <span className="lp-nav__logo-mark">⬡</span>
          <span className="lp-nav__logo-text">SkillForge</span>
        </div>
        <ul className="lp-nav__links">
          <li><a href="#features">Features</a></li>
          <li><a href="#testimonials">Stories</a></li>
          <li><a href="#stats">Stats</a></li>
        </ul>
        <div className="lp-nav__cta">
          <button className="lp-btn lp-btn--ghost" onClick={() => setModal('signin')}>
            Sign In
          </button>
          <button className="lp-btn lp-btn--primary" onClick={() => setModal('signup')}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero__bg" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="lp-hero__overlay" />

        <div className="lp-hero__content">
          <div className="lp-hero__left">
            <div className="lp-hero__badge">
              <span className="lp-hero__badge-dot" />
              Adaptive · Intelligent · Effective
            </div>
            <h1 className="lp-hero__title">
              Master Skills<br />
              <span className="lp-hero__title--accent">At the Speed</span><br />
              of Thought.
            </h1>
            <p className="lp-hero__subtitle">
              SkillForge is a next-generation learning platform that adapts to you —
              delivering personalized course paths, real-time progress analytics,
              and mastery-based assessments.
            </p>
            <div className="lp-hero__actions">
              <button className="lp-btn lp-btn--hero-primary" onClick={() => setModal('signup')}>
                <span>Start Learning Free</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button className="lp-btn lp-btn--hero-ghost" onClick={() => setModal('signin')}>
                Sign in to Dashboard
              </button>
            </div>
            <div className="lp-hero__trust">
              <div className="lp-hero__avatars">
                {['A','B','C','D'].map((l, i) => (
                  <div key={i} className="lp-hero__avatar" style={{ left: `${i * 28}px`, background: `hsl(${220 + i * 30}, 70%, 60%)` }}>{l}</div>
                ))}
              </div>
              <span className="lp-hero__trust-text">
                <strong>2,400+</strong> learners already on board
              </span>
            </div>
          </div>

          <div className="lp-hero__right">
            <div className="lp-hero__card-wrap">
              <div className="lp-hero__float-card">
                <img src={statsImage} alt="Learning dashboard preview" className="lp-hero__card-img" />
              </div>
            </div>
          </div>
        </div>

        <div className="lp-hero__scroll-cue">
          <span>Explore</span>
          <div className="lp-hero__scroll-line" />
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────── */}
      <section className="lp-statsbar" id="stats" ref={statsRef}>
        <StatItem value={2400} suffix="+" label="Active Learners" icon="👤" visible={statsVisible} />
        <div className="lp-statsbar__divider" />
        <StatItem value={156} suffix="" label="Expert-crafted Courses" icon="📚" visible={statsVisible} />
        <div className="lp-statsbar__divider" />
        <StatItem value={94} suffix="%" label="Completion Rate" icon="🎯" visible={statsVisible} />
        <div className="lp-statsbar__divider" />
        <StatItem value={4.8} suffix="★" label="Average Rating" icon="⭐" visible={statsVisible} isDecimal />
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section className="lp-features" id="features">
        <div className="lp-section-label">Why SkillForge</div>
        <h2 className="lp-section-title">Everything you need to grow — <span className="lp-accent">in one place.</span></h2>
        <p className="lp-section-sub">Purpose-built for learners who are serious about growth, and instructors who demand impact.</p>
        <div className="lp-features__grid">
          <FeatureCard
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
            color="#6C35DE"
            title="Adaptive Learning Paths"
            desc="Our engine analyzes your performance and adjusts course content, quiz difficulty, and pacing — so you're always in your optimal learning zone."
          />
          <FeatureCard
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
            color="#0ECAD4"
            title="Real-Time Progress Analytics"
            desc="Track module completion, quiz scores, time-on-task, and improvement trends with beautiful, interactive dashboards designed for clarity."
          />
          <FeatureCard
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
            color="#F59E0B"
            title="Live Quiz Engine"
            desc="Instructor-authored assessments with instant feedback, detailed explanations, and spaced-repetition scheduling to maximize long-term retention."
          />
          <FeatureCard
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
            color="#EC4899"
            title="Instructor Command Center"
            desc="Publish courses, manage modules, monitor learner performance across your cohort, and iterate on content with an intuitive admin dashboard."
          />
          <FeatureCard
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
            color="#10B981"
            title="Mastery Badges & Milestones"
            desc="Earn recognition for completing courses, hitting score milestones, and maintaining streaks — making the journey as rewarding as the destination."
          />
          <FeatureCard
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>}
            color="#8B5CF6"
            title="Bite-Sized Module Design"
            desc="Content broken into focused, digestible modules — perfectly sized for deep work sessions or quick knowledge bursts throughout your day."
          />
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────── */}
      <section className="lp-testimonials" id="testimonials">
        <div className="lp-section-label">Learner Stories</div>
        <h2 className="lp-section-title">Thousands of people.<br /><span className="lp-accent">One shared transformation.</span></h2>
        <div className="lp-testimonials__grid">
          <TestimonialCard
            quote="SkillForge completely changed how I approach learning. The adaptive paths felt like having a personal tutor who just gets me."
            name="Layla Hassan"
            role="Frontend Developer"
            initials="LH"
            color="#6C35DE"
          />
          <TestimonialCard
            quote="As an instructor, the analytics dashboard is a game changer. I can see exactly where my students struggle and fix it instantly."
            name="Marcus Reid"
            role="Data Science Instructor"
            initials="MR"
            color="#0ECAD4"
            featured
          />
          <TestimonialCard
            quote="I went from zero to landing my first developer job in 5 months. The quiz engine and progress tracking kept me accountable."
            name="Priya Nair"
            role="Junior Backend Engineer"
            initials="PN"
            color="#EC4899"
          />
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────── */}
      <section className="lp-cta-banner">
        <div className="lp-cta-banner__glow" />
        <div className="lp-cta-banner__content">
          <h2 className="lp-cta-banner__title">Your next chapter begins today.</h2>
          <p className="lp-cta-banner__sub">Join thousands of learners and instructors building the future — one skill at a time.</p>
          <button className="lp-btn lp-btn--hero-primary" onClick={() => setModal('signup')}>
            <span>Create Free Account</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-footer__logo">
          <span className="lp-nav__logo-mark">⬡</span> SkillForge
        </div>
        <p className="lp-footer__copy">© 2025 SkillForge. Built for those who never stop learning.</p>
        <div className="lp-footer__links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>

      {/* ── Modals ────────────────────────────────────── */}
      {modal && (
        <div className="lp-modal-overlay" onClick={handleOverlayClick}>
          {modal === 'signin' ? (
            <SignInModal
              onClose={() => setModal(null)}
              onSwitchToSignUp={() => setModal('signup')}
              onSuccess={() => navigate('/dashboard')}
              setSession={setSession}
            />
          ) : (
            <SignUpModal
              onClose={() => setModal(null)}
              onSwitchToSignIn={() => setModal('signin')}
              onSuccess={() => navigate('/dashboard')}
              setSession={setSession}
            />
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Sub-components ─────────────────────────────────────── */

function StatItem({ value, suffix, label, icon, visible, isDecimal }: {
  value: number; suffix: string; label: string; icon: string; visible: boolean; isDecimal?: boolean;
}) {
  const count = useCountUp(isDecimal ? 48 : value, 1800, visible);
  const display = isDecimal ? (count / 10).toFixed(1) : count.toLocaleString();
  return (
    <div className="lp-stat">
      <span className="lp-stat__icon">{icon}</span>
      <div className="lp-stat__number">{display}{suffix}</div>
      <div className="lp-stat__label">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, color, title, desc }: { icon: React.ReactNode; color: string; title: string; desc: string }) {
  return (
    <div className="lp-feature-card" style={{ '--card-accent': color } as React.CSSProperties}>
      <div className="lp-feature-card__icon" style={{ color }}>
        {icon}
      </div>
      <h3 className="lp-feature-card__title">{title}</h3>
      <p className="lp-feature-card__desc">{desc}</p>
    </div>
  );
}

function TestimonialCard({ quote, name, role, initials, color, featured }: {
  quote: string; name: string; role: string; initials: string; color: string; featured?: boolean;
}) {
  return (
    <div className={`lp-testimonial-card ${featured ? 'lp-testimonial-card--featured' : ''}`}>
      <div className="lp-testimonial-card__stars">★★★★★</div>
      <p className="lp-testimonial-card__quote">"{quote}"</p>
      <div className="lp-testimonial-card__author">
        <div className="lp-testimonial-card__avatar" style={{ background: color }}>{initials}</div>
        <div>
          <div className="lp-testimonial-card__name">{name}</div>
          <div className="lp-testimonial-card__role">{role}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sign In Modal ─────────────────────────────────────── */
function SignInModal({ onClose, onSwitchToSignUp, onSuccess, setSession }: {
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onSuccess: () => void;
  setSession: (token: string, user: { id: string; username: string; email: string; role: 'user' | 'admin' }) => void;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const auth = await loginRequest({ username, password });
      const user = await getCurrentUserRequest(auth.access_token);
      setSession(auth.access_token, user);
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-modal">
      <button className="lp-modal__close" onClick={onClose} aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div className="lp-modal__logo">
        <span className="lp-nav__logo-mark" style={{ fontSize: '2rem' }}>⬡</span>
      </div>
      <h2 className="lp-modal__title">Welcome back</h2>
      <p className="lp-modal__sub">Sign in to continue your learning journey</p>
      <form className="lp-modal__form" onSubmit={handleSubmit}>
        <div className="lp-modal__field">
          <label className="lp-modal__label">Username</label>
          <div className="lp-modal__input-wrap">
            <svg className="lp-modal__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input
              className="lp-modal__input"
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="lp-modal__field">
          <label className="lp-modal__label">Password</label>
          <div className="lp-modal__input-wrap">
            <svg className="lp-modal__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input
              className="lp-modal__input"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        {error && <div className="lp-modal__error">{error}</div>}
        <button className="lp-modal__submit" type="submit" disabled={loading}>
          {loading ? (
            <span className="lp-modal__spinner" />
          ) : (
            <>Sign In <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
          )}
        </button>
      </form>
      <p className="lp-modal__switch">
        New to SkillForge?{' '}
        <button className="lp-modal__switch-btn" onClick={onSwitchToSignUp}>Create an account</button>
      </p>
    </div>
  );
}

/* ─── Sign Up Modal ─────────────────────────────────────── */
function SignUpModal({ onClose, onSwitchToSignIn, onSuccess, setSession }: {
  onClose: () => void;
  onSwitchToSignIn: () => void;
  onSuccess: () => void;
  setSession: (token: string, user: { id: string; username: string; email: string; role: 'user' | 'admin' }) => void;
}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (username.length < 5) { setError('Username must be at least 5 characters.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await registerRequest({ username, email, password, role });
      const auth = await loginRequest({ username, password });
      const user = await getCurrentUserRequest(auth.access_token);
      setSession(auth.access_token, user);
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Try a different username.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-modal lp-modal--signup">
      <button className="lp-modal__close" onClick={onClose} aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div className="lp-modal__logo">
        <span className="lp-nav__logo-mark" style={{ fontSize: '2rem' }}>⬡</span>
      </div>
      <h2 className="lp-modal__title">Join SkillForge</h2>
      <p className="lp-modal__sub">Create your account and start learning today</p>
      <form className="lp-modal__form" onSubmit={handleSubmit}>
        <div className="lp-modal__field">
          <label className="lp-modal__label">Username</label>
          <div className="lp-modal__input-wrap">
            <svg className="lp-modal__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input className="lp-modal__input" type="text" placeholder="Choose a username (min 5 chars)" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
        </div>
        <div className="lp-modal__field">
          <label className="lp-modal__label">Email</label>
          <div className="lp-modal__input-wrap">
            <svg className="lp-modal__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <input className="lp-modal__input" type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
        </div>
        <div className="lp-modal__field">
          <label className="lp-modal__label">Password</label>
          <div className="lp-modal__input-wrap">
            <svg className="lp-modal__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input className="lp-modal__input" type="password" placeholder="Create a password (min 8 chars)" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
        </div>
        <div className="lp-modal__field">
          <label className="lp-modal__label">I am joining as</label>
          <div className="lp-modal__role-toggle">
            <button
              type="button"
              className={`lp-modal__role-btn ${role === 'user' ? 'lp-modal__role-btn--active' : ''}`}
              onClick={() => setRole('user')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Learner
            </button>
            <button
              type="button"
              className={`lp-modal__role-btn ${role === 'admin' ? 'lp-modal__role-btn--active lp-modal__role-btn--instructor' : ''}`}
              onClick={() => setRole('admin')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              Instructor
            </button>
          </div>
        </div>
        {error && <div className="lp-modal__error">{error}</div>}
        <button className="lp-modal__submit" type="submit" disabled={loading}>
          {loading ? (
            <span className="lp-modal__spinner" />
          ) : (
            <>Create Account <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
          )}
        </button>
      </form>
      <p className="lp-modal__switch">
        Already have an account?{' '}
        <button className="lp-modal__switch-btn" onClick={onSwitchToSignIn}>Sign in instead</button>
      </p>
    </div>
  );
}
