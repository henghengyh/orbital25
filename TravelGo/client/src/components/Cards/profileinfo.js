import { useNavigate } from "react-router-dom";

import { getInitials } from "../../utils/helper";

const REACT_PORT = 3000; //process.env.REACT_APP_API_PORT;
const imageURL = (`http://localhost:${REACT_PORT}`);

export default function ProfileInfo({ user, onLogout }) {
    const navigate = useNavigate();
    
    return (
        <div
            className="flex items-center justify-center gap-3 w-[180px]"
            onClick={() => navigate('/profile')}
        >
            {user?.profilePhoto ? (
                <img
                    src={`${imageURL}${user?.profilePhoto}`}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover cursor-pointer"
                />
            ) : (
                <div className="w-12 h-12 flex items-center justify-center rounded-full font-medium bg-blue-100 cursor-pointer">
                    {getInitials(user?.name)}
                </div>
            )}
            <div>
                <p className="text-base font-medium cursor-pointer">{user?.name}</p>
                <button className="text-base underline" onClick={onLogout}>Logout</button>
            </div>
        </div>
    )
}