export default function LogoutModal({ isOpen, onClose, onLogout }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
                <p className="mb-4">Are you sure you want to log out?</p>
                <div className="flex justify-end gap-2">
                    <button className="px-3 py-1 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={onLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}