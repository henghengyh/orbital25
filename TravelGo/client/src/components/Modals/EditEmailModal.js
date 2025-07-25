import { useEffect, useState } from "react";

import axiosInstance from "../../utils/axiosInstance";

export default function EditEmailModal({ isOpen, onClose, onEmailUpdated, currentEmail }) {
    // This is in alignment with the backend
    // which has two steps for email change : (1) Request code, (2) Verify code
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [newEmail, setNewEmail] = useState(currentEmail || "");
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setNewEmail(currentEmail || "");
            setCode("");
            setMessage("");
            setLoading(false);
        }
    }, [isOpen, currentEmail]);

    if (!isOpen) return null;

    const handleRequestCode = async () => {
        setLoading(true);
        setMessage("");
        try {
            const res = await axiosInstance.post("/users/request-email-change", { newEmail });
            setMessage(res.data.message);
            setStep(2);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to send verification code.");
        }
        setLoading(false);
    };

    const handleVerifyCode = async () => {
        setLoading(true);
        setMessage("");
        try {
            const res = await axiosInstance.post("/users/verify-email-change", { userCode: code });
            setMessage(res.data.message);
            if (res.data.success) {
                setTimeout(() => {
                    setMessage("");
                    setStep(1);
                    setCode("");
                    onEmailUpdated && onEmailUpdated(newEmail);
                    onClose();
                }, 1000);
            }
        } catch (err) {
            setMessage(err.response?.data?.message || "Verification failed.");
        }
        setLoading(false);
    };

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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                <h2 className="text-lg font-bold mb-4">Edit Email</h2>
                {step === 1 ? (
                    <>
                        {inputBox("email", setNewEmail, "Enter new email", newEmail)}
                        <div className="flex justify-end gap-2 mt-4">
                            <button className="px-3 py-1 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
                            <button
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={handleRequestCode}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send Code"}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {inputBox("text", setCode, "Enter verification code", code)}
                        <div className="flex justify-end gap-2 mt-4">
                            <button className="px-3 py-1 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
                            <button
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                                onClick={handleVerifyCode}
                                disabled={loading}
                            >
                                {loading ? "Verifying..." : "Verify"}
                            </button>
                        </div>
                    </>
                )}
                {message && (
                    <div className="mt-3 text-sm text-center text-blue-600">{message}</div>
                )}

            </div>
        </div>
    );
}