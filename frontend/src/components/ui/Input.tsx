import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = ({ label, className = '', ...props }: InputProps) => {
  const inputId = props.id ?? `${label.toLowerCase().replace(/\s+/g, '-')}-field`;

  return (
    <div className="field">
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <input id={inputId} className={`field__input ${className}`.trim()} {...props} />
    </div>
  );
};