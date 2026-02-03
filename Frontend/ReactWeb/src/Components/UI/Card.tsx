import React from 'react';

interface CardProps {
  title: string;
  subtitle?: string;
  onClick?: () => void;
  action?: React.ReactNode; 
  className?: string;
}

export const Card = ({ title, subtitle, onClick, action, className }: CardProps) => {
  return (
    <div 
      // Only make it look clickable if an onClick is provided
      className={`
        bg-white border border-gray-200 rounded-xl p-4 shadow-sm 
        flex justify-between items-center transition-all
        ${onClick ? 'cursor-pointer hover:shadow-md hover:border-blue-300' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Left Side: Text Info */}
      <div className="flex flex-col">
        <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>

      {/* Right Side: Optional Action (Delete button, Icon, Badge) */}
      {action && (
        <div 
          className="ml-4"
          onClick={(e) => e.stopPropagation()} // Stop the card click from firing when clicking the action
        >
          {action}
        </div>
      )}
    </div>
  );
};