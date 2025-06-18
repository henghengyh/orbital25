import { useState } from "react";
import { useUser } from "../../context/UserContext/usercontext";
import axiosInstance from "../../utils/axiosInstance";

import basicInfo from "../../components/Profile/basicinfo";
import DetailedInfo from "../../components/Profile/detailedInfo";
import EditNameModal from "../../components/Modals/EditNameModal";

function Profile() {
  const { user, setUser } = useUser();
  const [editField, setEditField] = useState(null);

  if (!user) return <div>Loading...</div>;

  const buttonStyle = "bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-2 w-30 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <EditNameModal
            isOpen={editField === "name"}
            currentName={user.name}
            onClose={() => setEditField(null)}
            onSave={async (newName) => {
                await axiosInstance.post('/users/update-username', {newName: newName})
                setEditField(null);
                setUser((existing) => ({ ...existing, name: newName }));
            }}
        />
        {basicInfo(user)}
        <hr className="my-4 border-gray-300" />
        <DetailedInfo user={user} onEditField={setEditField} />
        <hr className="my-4 border-gray-300" />
        <div className="flex justify-center gap-1.5">
            <button onClick={() => (null)} className={buttonStyle}>
                Logout
            </button>
        </div>
      {"message" && <div className="mt-4 text-green-600">{(null)}</div>}
    </div>
  );
}

export default Profile;