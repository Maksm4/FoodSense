export type BadgeColor = 'safe' | 'medium' | 'danger' | 'expired' | 'gray';

export const Badge = ({ color = 'gray', text }: { color?: BadgeColor, text: string }) => {
  const colors = {
    safe:   "bg-safe text-white",     
    medium: "bg-medium text-white",   
    danger: "bg-danger text-white",   
    gray:   "bg-gray-200 text-gray-800",
    expired: "bg-black text-white"
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors[color]}`}>
      {text}
    </span>
  );
};