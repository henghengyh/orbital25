import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext/usercontext";

export default function EditSignUpModal({ isOpen, onClose, onSave }) {
    const { user, setUser } = useUser();
    const [form, setForm] = useState({
        emailSignUp: user.emailSignUp || ""
    });

    useEffect(() => {
        setForm({
            emailSignUp: user.emailSignUp || "",
        });
    }, [user]);

    if (!isOpen) return null;

    const inputBox = (type, name, placeholder, value) => {
        return (
            <div className="flex items-center mb-3">
                <label className="w-40 mr-2">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                </label>
                <input
                    type={type}
                    name={name}
                    placeholder={"Enter new " + placeholder}
                    value={value}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                />
            </div>
        );
    }

    const dropdownBox = (display, name, options, value) => {
        return (
            <div className="flex items-center mb-3">
                <label className="w-40 mr-2">{display.charAt(0).toUpperCase() + display.slice(1)}</label>
                <select
                    name={name}
                    value={value}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                >
                    <option value="" disabled>Select {display}</option>
                    {options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>
        );
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-100 shadow-lg">
                <h2 className="text-lg font-bold mb-4">Edit Notifications</h2>
                <div className="space-y-3">
                    {dropdownBox("Email Signup", "emailSignUp", ["Yes", "No"], form.emailSignUp)}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="px-3 py-1 bg-gray-300 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                        onClick={() => onSave(form)}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}