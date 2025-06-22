/** Render Deployment
 *  URL: (`http://localhost:3000`); <=> (`https://travelgo-tl7w.onrender.com`);
*/ 

const URL = (`https://travelgo-tl7w.onrender.com`); // (`http://localhost:3000`);

function basicInfo(user) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">User Profile</h2>

            <div className="flex grid grid-cols-8 items-center gap-y-4">
                <span className="col-span-8 flex justify-center items-center">
                    <img
                        src={user.profilePhoto ? `${URL}${user.profilePhoto}` : "/default-avatar.png"}
                        alt="Profile"
                        className="w-60 h-60 rounded-full object-cover border"
                    />
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