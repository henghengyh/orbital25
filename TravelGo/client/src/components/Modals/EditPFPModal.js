import { useEffect, useRef, useState } from "react";

import { useUser } from "../../context/UserContext/usercontext";
import { getInitials } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

export default function EditPFPModal({ isOpen, onClose, onPhotoUpdated }) {
    // this part, new thing implemented to check if the upload is in progress 
    // so won't have multiple uploads to jam the system (defensive coding?)
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    // can preview (tried and tested)
    const [preview, setPreview] = useState("");
    // this code requires file importing
    const [selectedFile, setSelectedFile] = useState(null);
    const [success, setSuccess] = useState(false);

    const { user } = useUser();
    // NEW THING LEARNT: Reference to the file input element
    const fileInputRef = useRef();
    // EXAMPLE USAGE: <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />

    useEffect(() => {
        if (isOpen) {
            setSelectedFile(null);
            setPreview(user.profilePhoto || "");
            setMessage("");
            setSuccess(false);
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }, [isOpen, user.profilePhoto]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB in bytes
                setMessage("File size must be less than 10MB.");
                setSelectedFile(null);
                setPreview(user.profilePhoto || "");
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreview(user.profilePhoto || "");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage("Please select a photo to upload.");
            setSuccess(false);
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("photo", selectedFile);
        try {
            const res = await axiosInstance.post("/users/upload-profile-photo", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setMessage(res.data.message);
            setSuccess(res.data.success);
            onPhotoUpdated && onPhotoUpdated(res.data.profilePhoto);
            if (res.data.success) {
                setTimeout(() => {
                    setMessage("");
                    setSuccess(false);
                    onClose();
                }, 1000);
            } else {
                setMessage(res.data.message || "Error updating profile photo");
            }
        } catch (err) {
            setMessage("Failed to upload photo.");
            setSuccess(false);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.post("/users/delete-profile-photo");
            setMessage(res.data.message);
            setSuccess(res.data.success);
            onPhotoUpdated && onPhotoUpdated("");
            if (res.data.success) {
                setTimeout(() => {
                    setMessage("");
                    setSuccess(false);
                    onClose();
                }, 2000);
            } else {
                setMessage(res.data.message || "Error deleting profile photo");
            }
        } catch (err) {
            setMessage("Failed to delete photo.");
            setSuccess(false);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg flex flex-col items-center">
                <h2 className="text-lg font-bold mb-4">Edit Profile Photo</h2>
                <p className="mb-4">Note: Max Upload limit is 10 MB</p>
                <div className="mb-4 flex flex-col items-center">
                    {preview ? (
                        <img src={preview} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover border mb-2"
                        />
                    ) : (
                        <div role="img" aria-label="user initials" className="w-32 h-32 flex items-center justify-center rounded-full object-cover border text-3xl font-medium bg-blue-100 cursor-pointer">
                            {getInitials(user.name)}
                        </div>
                    )}
                    <input data-testid="file input" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef}
                        className="mb-2"
                    />
                </div>
                {message && (
                    <div className={`mb-2 text-sm ${success ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </div>
                )}
                <div className="flex justify-center gap-2 w-full">
                    <button className="px-3 py-1 bg-gray-300 rounded w-1/3" onClick={onClose} disabled={loading} >
                        Cancel
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded w-1/3" onClick={handleUpload} disabled={loading}>
                        Upload
                    </button>
                    <button className="px-3 py-1 bg-red-500  text-white rounded w-1/3" onClick={handleDelete} disabled={loading} >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}