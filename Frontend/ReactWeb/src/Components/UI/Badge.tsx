export type BadgeColor = 'safe' | 'medium' | 'danger' | 'gray';

export const Badge = ({ color = 'gray', text }: { color?: BadgeColor, text: string }) => {
  const colors = {
    safe:   "bg-safe text-white",     
    medium: "bg-medium text-white",   
    danger: "bg-danger text-white",   
    gray:   "bg-gray-200 text-gray-800",
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors[color]}`}>
      {text}
    </span>
  );
};