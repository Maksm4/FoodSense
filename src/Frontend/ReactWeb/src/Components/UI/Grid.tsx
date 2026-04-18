interface GridProps {
  children: React.ReactNode;
  className?: string;
}

export const Grid = ({ children, className = "" }: GridProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 ${className}`}>
      {children}
    </div>
  );
};