export default function FilterTag({ label, value, onClose }) {
    const fullText = `${label}: ${value}`;
    const displayText = fullText.length > 15 ? `${fullText.slice(0, 15)}...` : fullText;

    return (
        <div title={`${label}: ${value}`} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium ">
            {displayText}
            <button onClick={onClose} className="text-xs text-red-500 hover:text-red-700 flex items-center">
                <ion-icon name="close" style={{ height: "14px", width: "14px" }}></ion-icon>
            </button>
        </div>
    )
}