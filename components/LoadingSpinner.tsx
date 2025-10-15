
import React from 'react';

interface LoadingSpinnerProps {
  small?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ small = false }) => {
  const sizeClasses = small ? 'w-6 h-6' : 'w-12 h-12';
  const borderClasses = small ? 'border-2' : 'border-4';

  return (
    <div className={`${sizeClasses} ${borderClasses} border-amber-500 border-t-transparent rounded-full animate-spin`}></div>
  );
};

export default LoadingSpinner;
