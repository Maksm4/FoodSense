interface CardProps {
    title: string;
    subtitle?: string;
    isSelected?: boolean;
    className?: string;
    image?: React.ReactNode;
    action?: React.ReactNode;
    onClick?: () => void;
    onTouchStart?: () => void;
    onTouchEnd?: () => void;
    onMouseDown?: () => void;
    onMouseUp?: () => void;
    onMouseLeave?: () => void;
}

export const Card = ({ 
    title, 
    subtitle, 
    isSelected, 
    className, 
    image,
    action, 
    onClick,
    onTouchStart,
    onTouchEnd,
    onMouseDown,
    onMouseUp,
    onMouseLeave
}: CardProps) => {
    return (
        <div
            onClick={onClick}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            className={`
                flex items-center gap-3 p-3 bg-white rounded-2xl border-2 
                transition-all duration-200 cursor-pointer
                ${isSelected 
                    ? 'border-primary bg-selection-bg shadow-lg shadow-primary/10' 
                    : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                }
                ${className || ''}
            `}
        >
            {/* Image slot */}
            {image && image}

            {/* Text content */}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{title}</p>
                {subtitle && (
                    <p className="text-sm text-gray-500 truncate">{subtitle}</p>
                )}
            </div>

            {/* Action slot */}
            {action && (
                <div className="shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
};