import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = ({ label, ...props }: InputProps) => (
  <div style={{ marginBottom: '12px' }}>
    <label>{label}</label>
    <input {...props} style={{ display: 'block', width: '100%' }} />
  </div>
);