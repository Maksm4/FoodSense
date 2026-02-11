import { useState, useRef, useEffect } from "react";
import { Button } from "../UI/Button";
import { authService } from "../../api/authService";
import { useNavigate } from "react-router-dom";

interface ProfilePopupProps {
    userEmail?: string;
    userName?: string;
}

export default function ProfilePopup({ userEmail, userName }: ProfilePopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleResetPassword = () => {
        setIsOpen(false);
        //TODO: password reset
    };

    const handleLogout = () => {
        setIsOpen(false);
        authService.logout();
    };

    const handleShowSavedRecipes = () => {
        setIsOpen(false);
        navigate('/recipes/saved');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <Button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative"
            >
                <i className="fa-solid fa-user"></i>
            </Button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    {(userName || userEmail) && (
                        <>
                            <div className="px-4 py-3 bg-linear-to-r from-primary/5 to-safe/5 border-b border-gray-200">
                                <p className="font-semibold text-gray-800">{userName || 'User'}</p>
                                {userEmail && (
                                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                                )}
                            </div>
                        </>
                    )}

                    <div className="py-2">
                        {/* Saved Recipes */}
                        <button
                            onClick={handleShowSavedRecipes}
                            className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-bg-secondary transition-colors text-gray-700 hover:text-primary"
                        >
                            <i className="fa-solid fa-bookmark text-primary"></i>
                            <span className="font-medium">Saved Recipes</span>
                        </button>
                        {/* Reset Password */}
                        <button
                            onClick={handleResetPassword}
                            className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-bg-secondary transition-colors text-gray-700 hover:text-primary"
                        >
                            <i className="fa-solid fa-key text-primary"></i>
                            <span className="font-medium">Reset Password</span>
                        </button>

                        <div className="my-1 border-t border-gray-200"></div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-danger/10 transition-colors text-gray-700 hover:text-danger"
                        >
                            <i className="fa-solid fa-right-from-bracket text-danger"></i>
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}