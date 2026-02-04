interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button = ({ variant = 'primary', isLoading, children, className, ...props }: ButtonProps) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition disabled:opacity-50";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary: "bg-cancel text-gray-800 hover:bg-cancel-hover",
    danger: "bg-cancel-danger text-white hover:bg-cancel-danger-hover",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
      {isLoading ? "Processing..." : children}
    </button>
  );
};