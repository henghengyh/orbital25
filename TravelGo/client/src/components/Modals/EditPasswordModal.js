import { useState } from "react";

export default function EditProfileModal({ isOpen, onClose, onSave, currentEmail }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    
    if (!isOpen) return null;

    const inputBox = (type, f, placeholder, value) => {
        return (
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={e => f(e.target.value)}
                className="w-full border rounded px-2 py-1 mb-4"
            />
        );
    }

    const handleSave = async () => {
        try {
            const res = await onSave({ currentPassword, newPassword, confirmPassword });
            setMessage(res.data.message);
            if (res.data.success) {
                setTimeout(() => {
                    setMessage("Password updated successfully!");
                    setSuccess(true);
                    onClose();
                }, 3000);
            } else {
                setMessage(res.data.message || "Error updating password");
            }
        } catch (err) {
            setMessage(err.response?.data?.message || "Error updating password!!!!!");
            setSuccess(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                <h2 className="text-lg font-bold mb-4">Change Password</h2>
                <div className="">
                    {inputBox("password", setCurrentPassword, "Enter current password", currentPassword)}
                    {inputBox("password", setNewPassword, "Enter new password", newPassword)}
                    {inputBox("password", setConfirmPassword, "Confirm new password", confirmPassword)}
                    {
                        newPassword !== confirmPassword ? (
                            <div className="text-red-600 text-sm">
                                New password and confirmation do not match. Please try again.
                            </div>) : null
                    }
                </div>
                {message && (
                    <div className={`mb-2 text-sm ${success ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </div>
                )}
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="px-3 py-1 bg-gray-300 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}