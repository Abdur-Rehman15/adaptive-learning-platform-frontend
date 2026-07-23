import { useState } from 'react';
import type React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { getCurrentUserRequest, loginRequest } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';
import { useRegister } from '../hooks/useRegister';

export const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const { mutate: register, isPending, error } = useRegister();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (username.length < 5) {
      setLocalError('Username must be at least 5 characters long.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
      return;
    }

    register(
      { username, email, password, role },
      {
        onSuccess: async (_, variables) => {
          const auth = await loginRequest({
            username: variables.username,
            password: variables.password,
          });
          const currentUser = await getCurrentUserRequest(auth.access_token);
          setSession(auth.access_token, currentUser);
          navigate('/dashboard', { replace: true });
        },
      }
    );
  };

  return (
    <form className="auth-card__form" onSubmit={handleSubmit}>
      <Input
        label="Username"
        name="username"
        type="text"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      
      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="field">
        <span className="field__label">Workspace Role</span>
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          <button
            type="button"
            onClick={() => setRole('user')}
            className={`dashboard-btn ${role === 'user' ? 'dashboard-btn--primary' : 'dashboard-btn--sunken'}`}
            style={{ flex: 1, padding: '10px' }}
          >
            Learner
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`dashboard-btn ${role === 'admin' ? 'dashboard-btn--accent' : 'dashboard-btn--sunken'}`}
            style={{ flex: 1, padding: '10px' }}
          >
            Instructor
          </button>
        </div>
      </div>

      <button className="auth-card__button" type="submit" disabled={isPending}>
        {isPending ? 'CREATING ACCOUNT…' : 'Sign up'}
      </button>

      <p className="auth-card__switcher">
        Already have an account?{' '}
        <Link to="/login" className="auth-card__link">
          Sign in
        </Link>
      </p>

      {(error || localError) && (
        <p className="auth-card__error">{localError || error?.message}</p>
      )}
    </form>
  );
};
