import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/features/auth/context/AuthContext';
import { StudentCoursesView } from '@/features/studentCourses/components/StudentCoursesView';

export const CoursesPage = () => {
  const { user, role, isHydrating } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isHydrating && (!user || !role)) {
      navigate('/login', { replace: true });
    }
  }, [user, role, isHydrating, navigate]);

  if (isHydrating) {
    return (
      <div className="auth-shell">
        <div 
          className="auth-card" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '16px',
            textAlign: 'center'
          }}
        >
          <div className="auth-card__eyebrow">System Control</div>
          <h1 className="auth-card__title" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
            Securing Connection
          </h1>
          <p className="auth-card__intro" style={{ margin: 0 }}>
            Verifying cryptographic token and active session parameters.
          </p>
          <div 
            style={{ 
              fontFamily: 'JetBrains Mono, monospace', 
              fontWeight: 600, 
              fontSize: '0.875rem', 
              color: 'var(--color-primary)',
              marginTop: '12px',
              letterSpacing: '0.05em'
            }}
          >
            VERIFYING AUTHORIZATION…
          </div>
        </div>
      </div>
    );
  }

  if (!user || !role) {
    return null;
  }

  return (
    <div className="app-shell">
      <Navbar role={role} />
      <main className="app-shell__content">
        <StudentCoursesView />
      </main>
      <Footer role={role} />
    </div>
  );
};
export default CoursesPage;
