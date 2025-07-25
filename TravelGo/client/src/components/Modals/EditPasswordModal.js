import { useEffect, useState } from "react";

export default function EditProfileModal({ isOpen, onClose, onSave, currentEmail }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [feedback, setFeedback] = useState("");
    const [success, setSuccess] = useState(false);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMessage("");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const inputBox = (type, f, placeholder, value, show, setShow) => {
        return (
            <div className="relative mb-4 h-10 flex items-center">
                <input
                    type={show ? "text" : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => f(e.target.value)}
                    className="w-full border rounded px-2 py-1 pr-14 h-full"
                />
                <button
                    type="button"
                    aria-label="show hide"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 h-6 flex items-center no-underline hover:underline"
                    onClick={() => setShow(s => !s)}
                    tabIndex={-1}
                >
                    <ion-icon name={show ? "eye-off" : "eye"} style={{ height: "24px", width: "24px" }}></ion-icon>
                </button>
            </div>
        );
    }

    const handleSave = async () => {
        try {
            const res = await onSave({ currentPassword, newPassword, confirmPassword });
            setSuccess(res.data.success);
            if (res.data.success) {
                setMessage(res.data.message);
            } else {
                setMessage(res.data.message || "Error updating password");
            }
            setTimeout(() => {
                setMessage("");
                setSuccess(false);
                onClose();
            }, 1000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error updating password");
            setFeedback(err.response?.data?.feedback?.join(" ") || "");
            setSuccess(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                <h2 className="text-lg font-bold mb-4">Change Password</h2>
                <div className="">
                    {inputBox("password", setCurrentPassword, "Enter current password", currentPassword, showCurrent, setShowCurrent)}
                    {inputBox("password", setNewPassword, "Enter new password", newPassword, showNew, setShowNew)}
                    {inputBox("password", setConfirmPassword, "Confirm new password", confirmPassword, showConfirm, setShowConfirm)}
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
                {feedback && (
                    <div className={`mb-2 text-sm ${success ? "text-green-600" : "text-red-600"}`}>
                        {feedback}
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