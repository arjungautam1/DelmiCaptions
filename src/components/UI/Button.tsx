import React from 'react';
import { Button as BSButton, ButtonProps as BSButtonProps } from 'react-bootstrap';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends BSButtonProps {
  loading?: boolean;
  compact?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  loading = false, 
  disabled = false,
  compact = false,
  className = '',
  size,
  ...props 
}) => {
  const compactClass = compact ? 'btn-compact' : '';
  const combinedClassName = `${compactClass} ${className}`.trim();

  return (
    <BSButton
      {...props}
      size={size}
      disabled={disabled || loading}
      className={combinedClassName}
    >
      {loading && (
        <LoadingSpinner size="sm" className="me-2" />
      )}
      {children}
    </BSButton>
  );
};

export default Button;