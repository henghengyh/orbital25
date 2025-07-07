export default function WarningModal({ isOpen, onClickFunction, title, text, exitText }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <p className="text-gray-600 mb-4">
                    {text}
                </p>
                <button
                    onClick={onClickFunction}
                    className="itinerary-button bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 w-full"
                >
                    {exitText || "OK"}
                </button>
            </div>
        </div>
    );
}