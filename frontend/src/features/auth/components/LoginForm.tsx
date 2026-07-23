import { useState } from 'react';
import type React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { useLogin } from '../hooks/useLogin';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { username, password },
      {
        onSuccess: () => navigate('/dashboard'),
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
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="auth-card__button" type="submit" disabled={isPending}>
        {isPending ? 'VERIFYING…' : 'Sign in'}
      </button>
      <p className="auth-card__switcher">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="auth-card__link">
          Sign up
        </Link>
      </p>
      {error && <p className="auth-card__error">{error.message}</p>}
    </form>
  );
};