import { useState, useEffect } from "react";

export default function EditNameModal({ isOpen, onClose, onSave, currentName }) {
    const [newName, setNewName] = useState(currentName);

    useEffect(() => {
        setNewName(currentName);
    }, [currentName]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                <h2 className="text-lg font-bold mb-4">Edit Name</h2>
                <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                            if (e.key === "Enter") onSave(newName);
                    }}
                    className="w-full border rounded px-2 py-1 mb-4"
                />
                <div className="flex justify-end gap-2">
                    <button
                        className="px-3 py-1 bg-gray-300 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                        onClick={() => onSave(newName)}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}