function basicInfo(user) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">User Profile</h2>

            <div className="grid grid-cols-8 items-center gap-y-4">
                <span className="col-span-2">
                    <img
                        src={user.profilePhoto ? `http://localhost:3000${user.profilePhoto}` : "/default-avatar.png"}
                        alt="Profile"
                        className="w-20 h-auto rounded-full object-cover border"
                    />
                </span>
                <span className="col-start-3 col-span-6 font-bold text-2xl"> {user.name}</span>
                <span className="col-start-1 col-span-8 text-center text-sm text-gray-500">
                    {user.profileInfo.bio}
                </span>
            </div>
        </div>
    );
}

export default basicInfo;