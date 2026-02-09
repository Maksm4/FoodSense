interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  isSelected?: boolean;
}

export const Card = ({ title, subtitle, action, isSelected, className, ...props }: CardProps) => {
  return (
    <div 
      className={`
        border rounded-xl p-4 shadow-sm 
        flex justify-between items-center transition-all duration-200
        ${props.onClick ? 'cursor-pointer' : ''}
        
        /* Logic for Selection State using your variables */
        ${isSelected 
            ? 'ring-2 ring-selection bg-selection-bg border-selection' 
            : 'border-gray-200 hover:border-primary/50'
        }
        ${className}
      `}
      {...props}
    >
      <div className="flex flex-col">
        <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>

      {action && (
        <div className="ml-4" onClick={(e) => e.stopPropagation()}>
          {action}
        </div>
      )}
    </div>
  );
};