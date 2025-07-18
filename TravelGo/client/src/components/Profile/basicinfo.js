import { getInitials } from "../../utils/helper";

function basicInfo({ user }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">User Profile</h2>

            <div className="grid grid-cols-8 items-center gap-y-4">
                <span className="col-span-8 flex justify-center items-center">
                    {user?.profilePhoto ? (
                        <img
                            src={user.profilePhoto || "/default-avatar.png"}
                            alt="Profile"
                            className="w-60 h-60 rounded-full object-cover border"
                        />
                    ) : (
                        <div role="img" aria-label="user initials" className="w-60 h-60 flex items-center justify-center rounded-full object-cover border text-6xl font-medium bg-blue-100 cursor-pointer">
                            {getInitials(user.name)}
                        </div>
                    )}
                </span>
                <span className="col-start-4 col-span-2 font-bold items-center text-center text-2xl"> {user.name}</span>
                <span className="col-start-1 col-span-8 text-center text-sm text-gray-500">
                    {user.profileInfo.bio}
                </span>
            </div>
        </div>
    );
}

export default basicInfo;