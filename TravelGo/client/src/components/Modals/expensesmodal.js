import { useCallback, useEffect, useReducer, useState } from "react";

import { formatDate, getRate } from "../../utils/helper";
import currencyCodes from "../../utils/currencylist";

export default function ExpensesModal({ mode, data, onClose, onAdd, onEdit, onDelete }) {
    const [currency, setCurrency] = useState(data?.currency || "SGD");
    const [date, setDate] = useState(data?.date || formatDate(new Date().toISOString()));
    const [error, setError] = useState("");
    const [hasMounted, setHasMounted] = useState(false);
    const [notes, setNotes] = useState(data?.notes || "");
    const [popup, setPopup] = useState(false);
    const [title, setTitle] = useState(data?.title || "");
    const [type, setType] = useState(data?.type || "");
    const [whoPaid, setWhoPaid] = useState(data?.whoPaid || "");

    const edit = mode === "edit";
    const typesOfExpenses = ["accommodation", "activities", "food", "gift", "others", "shopping", "transport"];
    const initialState = {
        amount: data?.amount.toString() || "0",
        displayAmt: "0.00"
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case "SET_AMOUNT":
                return { ...state, amount: action.payload };
            case "SET_DISPLAY_AMT":
                return { ...state, displayAmt: action.payload };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const amtInCurrency = useCallback(async (amount) => {
        if (mode === "edit" && currency !== "SGD") {
            const rate = await getRate(currency);
            if (rate) return Number(rate * amount).toFixed(2);
        }
        return Number(amount).toFixed(2);
    }, [mode, currency]);

    useEffect(() => {
        const convertAmt = async () => {
            dispatch({ type: "SET_DISPLAY_AMT", payload: state.amount === 0 ? "0.00" : await amtInCurrency(parseFloat(state.amount)) });
            setHasMounted(true);
        };

        convertAmt();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validInputCheck = (fn) => {
        if (!title) { setError("Invalid Title"); return; }
        if (!date) { setError("Invalid Date"); return; }
        if (!state.amount || state.amount <= 0) { setError("Invalid Amount"); return; }
        if (!currency) { setError("Invalid Currency"); return; }
        if (!whoPaid) { setError("Invalid Person Paid"); return; }
        if (!type || type === "") { setError("Invalid Expenses Type"); return; }
        fn();
    }

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
                <h5 className="text-xl font-semibold">{edit ? "Edit Expenses" : "Add Expenses"}</h5>
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

            <div className="px-3">
                <div className="flex flex-col gap-3">
                    <h6 className="text-label">Title:</h6>
                    <input
                        type="text"
                        placeholder="title"
                        name="title"
                        value={title}
                        autoComplete="off"
                        required
                        className="text-input"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="pt-2 flex gap-5">
                    <div className="flex flex-col gap-3">
                        <label htmlFor="date" className="text-label">Date:</label>
                        <input
                            id="date"
                            type="date"
                            placeholder="date"
                            name="date"
                            value={formatDate(date)}
                            required
                            className="text-input w-[142px]"
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <h6 className="text-label">Amount:</h6>
                        <input
                            type="number"
                            placeholder="0"
                            name="amount"
                            value={hasMounted ? state.displayAmt : state.amount}
                            min={0}
                            required
                            className="text-input w-[122px]"
                            onChange={(e) => { dispatch({ type: "SET_AMOUNT", payload: e.target.value || 0 }); setHasMounted(false); }}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <h6 className="text-label">Currency:</h6>
                        <input
                            type="text"
                            placeholder="currency"
                            list="currency-codes"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                            className="w-[160px] h-9 px-4 py-1 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 focus:outline-none"
                        />
                        <datalist id="currency-codes">
                            {currencyCodes.map((c) => (
                                <option key={c} value={c} />
                            ))}
                        </datalist>
                    </div>
                </div>
                <div className="flex gap-5 pt-4">
                    <div className="flex flex-col gap-3">
                        <h6 className="text-label">Who Paid:</h6>
                        <input
                            type="text"
                            placeholder="Me"
                            name="whoPaid"
                            value={whoPaid}
                            autoComplete="off"
                            required
                            className="text-input w-[162px]"
                            onChange={(e) => setWhoPaid(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label htmlFor="type" className="text-label">Type:</label>
                        <select
                            id="type"
                            value={type}
                            required
                            onChange={(e) => setType(e.target.value)}
                            className="w-[285px] h-9 px-3 py-1 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 focus:outline-none cursor-pointer"
                        >
                            <option disabled value="">Select type</option>
                            {typesOfExpenses.map((expenses) => (
                                <option key={expenses} value={expenses}>
                                    {expenses}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                    <h6 className="text-label">Notes:</h6>
                    <textarea
                        type="text"
                        placeholder="notes"
                        name="notes"
                        rows={4}
                        autoComplete="off"
                        value={notes}
                        className="text-input overflow-y-auto scrollbar"
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                {edit
                    ? <div className="flex gap-2 mt-7 w-full h-10">
                        <button onClick={(e) => {
                            e.preventDefault();
                            validInputCheck(() => onEdit(data._id, { title, date, amount: parseFloat(state.amount), currency, type, whoPaid, notes }));
                        }}
                            className="itinerary-button bg-green-200 hover:bg-green-300">
                            <ion-icon name="pencil"></ion-icon>
                            Save
                        </button>
                        <button onClick={(e) => { e.preventDefault(); onDelete(data._id); }}
                            className="itinerary-button bg-red-200 hover:bg-red-300">
                            <ion-icon name="trash"></ion-icon>
                            Delete
                        </button>
                    </div>
                    : <button
                        onClick={(e) => {
                            e.preventDefault();
                            validInputCheck(() => onAdd({ title, date, amount: state.amount, currency, type, whoPaid, notes }));
                        }}
                        className="flex gap-2 mt-7 w-full h-10 itinerary-button bg-green-200 hover:bg-green-300">
                        <ion-icon name="pencil"></ion-icon>
                        Add
                    </button>}
            </div>
        </div>
    )
} 