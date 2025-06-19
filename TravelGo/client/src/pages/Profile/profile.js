import { useState } from "react";
import { useUser } from "../../context/UserContext/usercontext";
import axiosInstance from "../../utils/axiosInstance";

import basicInfo from "../../components/Profile/basicinfo";
import DetailedInfo from "../../components/Profile/detailedInfo";
import EditProfileModal from "../../components/Modals/EditProfileModal";
import EditEmailModal from "../../components/Modals/EditEmailModal";
import EditPasswordModal from "../../components/Modals/EditPasswordModal";
import EditSignUpModal from "../../components/Modals/EditSignUpModal";

function Profile() {
  const { user, setUser } = useUser();
  const [editEmailOpen, setEditEmailOpen] = useState(false);
  const [editPWOpen, setEditPWOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editSignUpOpen, setEditSignUpOpen] = useState(false);

  if (!user) return <div>Loading...</div>;

  const buttonStyle = "bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-2 w-30 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
        <EditProfileModal
            isOpen={editProfileOpen}
            onClose={() => setEditProfileOpen(null)}
            onSave={async (form) => {
                const res = await axiosInstance.post('/users/update-profile', form);
                setUser(res.data.updatedUser);
                setEditProfileOpen(false);
            }}
            user={user}
        />
        <EditEmailModal
            isOpen={editEmailOpen}
            onClose={() => setEditEmailOpen(false)}
            currentEmail={user.email}
            onEmailUpdated={(newEmail) => setUser((prev) => ({ ...prev, email: newEmail }))}
        />
        <EditPasswordModal
            isOpen={editPWOpen}
            onClose={() => setEditPWOpen(false)}
            onSave={async ({ currentPassword, newPassword, confirmPassword }) => {
                await axiosInstance.post('/users/update-password', {
                    currentPassword,
                    newPassword,
                    confirmPassword
                });
                setEditPWOpen(false);
            }}
        />
        <EditSignUpModal
            isOpen={editSignUpOpen}
            onClose={() => setEditSignUpOpen(false)}
            onSave={async (form) => {
                const newBool = form.emailSignUp === "Yes" ? true : false;
                const res = await axiosInstance.post('/users/update-email-signup', { emailSignUp: newBool });
                
                setUser(res.data.updatedUser);
                setEditSignUpOpen(false);
            }}
        />


        {basicInfo(user)}
        <hr className="my-4 border-gray-300" />
        <DetailedInfo user={user} onEditEmail={() => setEditEmailOpen(true)} onEditPW={() => setEditPWOpen(true)} onEditSignUp={() => setEditSignUpOpen(true)} onEditProfile={() => setEditProfileOpen(true)} />
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