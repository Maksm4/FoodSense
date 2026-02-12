import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <i className="fa-solid fa-circle-notch fa-spin text-4xl text-primary"></i>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={`/auth?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
    }

    return <>{children}</>;
}