import { authService } from "../../api/authService";

interface LogoutProps {
    className?: string;
}

export default function Logout({ className }: LogoutProps) {
    const handleLogout = () => {
        authService.logout();
    };

    return (
        <button
            onClick={handleLogout}
            className={className || "w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-danger/10 transition-colors text-gray-700 hover:text-danger"}
        >
            <i className="fa-solid fa-right-from-bracket text-danger"></i>
            <span className="font-medium">Logout</span>
        </button>
    );
}