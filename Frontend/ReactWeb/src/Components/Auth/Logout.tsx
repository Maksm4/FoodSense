import { useNavigate } from "react-router-dom";
import { authService } from "../../api/authService";

export default function Logout() {
    const navigate = useNavigate();

    const handleClick = async () => {
        authService.logout();
        navigate('/');
    }
    return (<div className=" ">
        <button onClick={handleClick} className="border rounded-lg px-7 bg-cancel hover:bg-cancel-hover">
            Logout
        </button>
    </div>
    )
}