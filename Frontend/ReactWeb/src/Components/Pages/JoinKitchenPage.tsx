import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { kitchenService } from "../../api/kitchenService";

export default function JoinKitchenPage() {
    const { inviteCode } = useParams();
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const [status, setStatus] = useState("Processing...");

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) {
             navigate(`/auth?returnUrl=/join/${inviteCode}`);
             return;
        }

        const join = async () => {
            if (!inviteCode) return;
            
            try {
                 setStatus("Joining kitchen...");
                 await kitchenService.joinKitchen(inviteCode);
                 navigate('/kitchens');
            } catch (err) {
                 console.error(err);
                 alert("Failed to join kitchen. The link might be expired.");
                 navigate('/kitchens');
            }
        };

        join();

    }, [isAuthenticated, isLoading, inviteCode, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <i className="fa-solid fa-circle-notch fa-spin text-4xl text-primary mb-4"></i>
                <p className="text-gray-600 font-semibold">{status}</p>
            </div>
        </div>
    );
}