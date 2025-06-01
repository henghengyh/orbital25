import { getInitials } from "../../utils/helper"

export default function ProfileInfo({ user, onLogout }) {
    return (
        <div className="flex items-center justify-center gap-3 w-[180px]">
            <div className="w-12 h-12 flex items-center justify-center rounded-full font-medium bg-blue-100 cursor-pointer">
                {getInitials(user?.name)}
            </div>
            <div>
                <p className="text-base font-medium cursor-pointer">{user?.name}</p>
                <button className="text-base underline" onClick={onLogout}>Logout</button>
            </div>
        </div>
    )
}