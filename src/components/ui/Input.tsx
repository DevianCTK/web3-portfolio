import { forwardRef, type InputHTMLAttributes } from 'react';
import './ui.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className={`ui-input-wrapper ${error ? 'ui-input--error' : ''}`}>
        {label && (
          <label className="ui-input-label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`ui-input ${className}`}
          {...props}
        />
        {error && <p className="ui-input-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
