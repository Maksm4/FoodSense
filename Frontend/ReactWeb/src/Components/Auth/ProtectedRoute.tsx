import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('jwt_token');

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children} </>;
}