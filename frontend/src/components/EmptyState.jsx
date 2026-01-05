import React from 'react';
import Button from './Button';

const EmptyState = ({ 
  title = 'No items found', 
  description = '', 
  icon = '📭',
  actionLabel,
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-6 text-center max-w-md">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
