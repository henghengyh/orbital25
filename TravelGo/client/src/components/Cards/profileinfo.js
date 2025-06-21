import { getInitials } from "../../utils/helper"
import { useNavigate } from "react-router-dom";

const REACT_PORT = 3000; //process.env.REACT_APP_API_PORT;

const imageURL = (`http://localhost:${REACT_PORT}`);

export default function ProfileInfo({ user, setLogoutOpen }) {
    const navigate = useNavigate();
    return (
        <div
            className="flex items-center justify-center gap-3 w-[180px]"
        >
            {user?.profilePhoto ? (
                <img
                    src={`${imageURL}${user?.profilePhoto}`}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover cursor-pointer"
                    onClick={() => navigate('/profile')}
                />
            ) : (
                <div 
                    className="w-12 h-12 flex items-center justify-center rounded-full font-medium bg-blue-100 cursor-pointer"
                    onClick={() => navigate('/profile')}
                >
                    {getInitials(user?.name)}
                </div>
            )}
            <div>
                <p className="text-base font-medium cursor-pointer">{user?.name}</p>
                <button className="text-base underline" onClick={() => setLogoutOpen(true)}>Logout</button>
            </div>
        </div>
    )
}