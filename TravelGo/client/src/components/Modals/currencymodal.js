import { useEffect, useState } from "react";

export default function CurrencyModal({ type, data, onClose, setCurrency }) {
    const [error, setError] = useState("");
    const [newCurrency, setNewCurrency] = useState(data || 1);
    const [popup, setPopup] = useState(false);

    const handleSearch = () => {
        if (newCurrency === "") { setError("Invalid Currency"); return; }
        setCurrency(newCurrency);
        onClose();
    }

    const handleKeyDown = (event) => { if (event.key === 'Enter') handleSearch(); };

    useEffect(() => {
        if (error) {
            setPopup(true);
            setTimeout(() => {
                setPopup(false);
                setError("");
            }, 3000);
            window.history.replaceState({}, document.title);
        }
    }, [error]);

    return (
        <div className="flex flex-col w-full h-full">
            {popup && <div className="error">{error}</div>}
            <div className="flex items-center justify-between pl-5 pr-3 py-2">
                <h5 className="text-xl font-semibold">{type === "budget" ? "Edit Budget" : "Change Currency"}</h5>
                <div onClick={onClose} className="cursor-pointer rounded-full hover:bg-slate-200">
                    <ion-icon
                        name="close"
                        style={{
                            alignItems: "center",
                            display: "flex",
                            height: "20px",
                            width: "20px"
                        }}
                    />
                </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-4 mt-4">
                <label className="text-center w-fit font-semibold text-xl text-blue-600">
                    Input new Currency:
                </label>
                    <input
                        type="text"
                        placeholder="SGD"
                        value={newCurrency}
                        onChange={(e) => setNewCurrency(e.target.value.toUpperCase())}
                        onKeyDown={handleKeyDown}
                        className="max-w-xs px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
            </div>

            <div className="flex items-center justify-center mt-7 w-full h-10">
                <div onClick={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}
                    className="itinerary-button h-10 bg-green-200 hover:bg-green-300">
                    <ion-icon name="pencil"></ion-icon>
                    Save
                </div>
            </div>
        </div>
    )
}