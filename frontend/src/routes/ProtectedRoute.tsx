import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated, isHydrating } = useAuth();

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

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};