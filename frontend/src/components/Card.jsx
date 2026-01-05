import React from 'react';

const Card = ({ children, className = '', hover = true, padding = 'default' }) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hover ? 'hover:shadow-lg hover:scale-[1.02]' : '';

  return (
    <div className={`bg-white rounded-xl shadow-md transition-all duration-300 ${hoverStyles} ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
