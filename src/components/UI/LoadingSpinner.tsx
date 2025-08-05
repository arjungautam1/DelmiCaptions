import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
  size?: 'sm';
  variant?: 'primary' | 'secondary' | 'light' | 'dark';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'sm',
  variant = 'primary',
  className = ''
}) => {
  return (
    <Spinner
      animation="border"
      size={size}
      variant={variant}
      className={className}
      role="status"
      aria-label="Loading"
    />
  );
};

export default LoadingSpinner;