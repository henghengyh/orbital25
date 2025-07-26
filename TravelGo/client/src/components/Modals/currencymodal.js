import { useEffect, useState } from "react";

import { getRate } from "../../utils/helper";
import currencyCodes from "../../utils/currencylist";

export default function CurrencyModal({ data, onClose, setCurrency, setXRate }) {
    const [error, setError] = useState("");
    const [newCurrency, setNewCurrency] = useState(data || "SGD");
    const [popup, setPopup] = useState(false);

    const handleSearch = async () => {
        if (newCurrency === "") { setError("Invalid currency"); return; }
        const rate = await getRate(newCurrency);
        if (rate) {
            setCurrency(newCurrency);
            setXRate(rate);
            onClose();
        } else {
            setError("Invalid currency");
        }
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
                <h5 className="text-xl font-semibold">Change Currency</h5>
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
                <div className="flex justify-center">
                    <input
                        type="text"
                        placeholder="Type or select a code"
                        list="currency-codes"
                        value={newCurrency}
                        autoFocus
                        onChange={(e) => setNewCurrency(e.target.value.toUpperCase())}
                        onKeyDown={handleKeyDown}
                        className="max-w-xs h-12 px-4 py-2 border border-blue-300 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-200 ease-in-out cursor-pointer hover:border-blue-400"
                    />
                    <datalist id="currency-codes">
                        {currencyCodes.map((c) => (
                            <option key={c} value={c} />
                        ))}
                    </datalist>
                </div>
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