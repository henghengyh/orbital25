import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";

import { convertToSGD, formatDate } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import currencyCodes from "../../utils/currencylist";
import EmptyExpenses from "../../components/Cards/emptyexpenses";
import ExpensesDetailedCard from "../../components/Cards/expensesdetailedcard";
import ExpensesModal from "../../components/Modals/expensesmodal";
import FilterTag from "../../components/Cards/filtertag";
import SearchLoading from "../../components/Loading/searchloading";

export default function AllExpenditure() {
    const [allExpenses, setAllExpenses] = useState([]);
    const [currency, setCurrency] = useState("SGD");
    const [endDate, setEndDate] = useState(null);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState(false);
    const [filterExpenses, setFilterExpenses] = useState(allExpenses);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [maxAmount, setMaxAmount] = useState(0);
    const [message, setMessage] = useState("");
    const [minAmount, setMinAmount] = useState(0);
    const [openModal, setOpenModal] = useState({ shown: false, mode: "add", data: null });
    const [popup, setPopup] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [type, setType] = useState("");
    const [whoPaid, setWhoPaid] = useState("");

    const { id, xRate } = useParams();
    const navigate = useNavigate();
    const typesOfExpenses = ["accommodation", "activities", "food", "gift", "others", "shopping", "transport"];

    const fetchAllExpenses = useCallback(() => {
        setLoading(true);
        axiosInstance
            .get(`/expenses/${id}/all-expenses`)
            .then(res => { setAllExpenses(res.data.allExpenses); setFilterExpenses(res.data.allExpenses); })
            .catch(err => console.error(err.error))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        fetchAllExpenses();
    }, [fetchAllExpenses]);

    const onAdd = async (data) => {
        axiosInstance
            .post(`/expenses/${id}`, { ...data, amount: await convertToSGD(data.amount, data.currency) })
            .then(res => { setMessage(res.data.message); fetchAllExpenses(); })
            .catch(err => { console.error(err); setError(err.response.data.error); })
            .finally(() => setOpenModal({ shown: false, mode: "budget", data: null }));
    };

    const editExpenses = (data) => setOpenModal({ shown: true, mode: "edit", data: data });

    const onEdit = async (expensesId, data) => {
        axiosInstance
            .put(`/expenses/${id}/${expensesId}`, { ...data, amount: await convertToSGD(data.amount, data.currency) })
            .then(res => { setMessage(res.data.message); fetchAllExpenses(); })
            .catch(err => { console.error(err); setError(err.response.data.error); })
            .finally(() => setOpenModal({ shown: false, mode: "budget", data: null }));
    };

    const onDelete = (expensesId) => {
        axiosInstance
            .delete(`/expenses/${id}/${expensesId}`)
            .then(res => { setMessage(res.data.message); fetchAllExpenses(); })
            .catch(err => { console.error(err); setError(err.response.data.error); })
            .finally(() => setOpenModal({ shown: false, mode: "budget", data: null }));
    };

    const reset = () => {
        setCurrency("SGD");
        setEndDate(null);
        setFilterExpenses(allExpenses);
        setKeyword("");
        setMaxAmount(0);
        setMinAmount(0);
        setStartDate(null);
        setType("");
        setWhoPaid("");
    };

    const validInputCheck = (fn) => {
        if (currency && minAmount <= 0 && maxAmount <= 0) { setMessage("Please input valid search"); return; }
        fn();
    }

    const handleSearch = async (data) => {
        let filtered = [...allExpenses];
        if (data.keyword) {
            filtered = filtered.filter(e => e.title.toLowerCase().includes(data.keyword.toLowerCase().trim()) || e.notes.toLowerCase().includes(data.keyword.toLowerCase().trim()));
        }
        if (data.type) {
            filtered = filtered.filter(e => e.type === data.type);
        }
        if (data.whoPaid) {
            filtered = filtered.filter(e => e.whoPaid.toLowerCase().includes(data.whoPaid.toLowerCase().trim()));
        }
        if (data.startDate) {
            filtered = filtered.filter(e => formatDate(e.date) >= data.startDate);
        }
        if (data.endDate) {
            filtered = filtered.filter(e => formatDate(e.date) <= data.endDate);
        }
        if (data.minAmount > 0) {
            const sgdAmt = await convertToSGD(data.minAmount, data.currency);
            filtered = filtered.filter(e => e.amount >= sgdAmt);
        }
        if (data.maxAmount !== 0 && data.maxAmount > data.minAmount) {
            const sgdAmt = await convertToSGD(data.maxAmount, data.currency)
            filtered = filtered.filter(e => e.amount <= sgdAmt);
        }
        setFilterExpenses(filtered);
        setFilter(false);
    };

    const showFiltered = () => {
        const tags = [];

        if (keyword) tags.push(<FilterTag key="keyword" label="Keyword" value={keyword} onClose={() => { setKeyword(""); handleSearch({ type, whoPaid, startDate, endDate, minAmount, maxAmount, currency }) }} />);
        if (type) tags.push(<FilterTag key="type" label="Type" value={type} onClose={() => { setType(""); handleSearch({ keyword, whoPaid, startDate, endDate, minAmount, maxAmount, currency }) }} />);
        if (whoPaid) tags.push(<FilterTag key="whoPaid" label="Who Paid" value={whoPaid} onClose={() => { setWhoPaid(""); handleSearch({ keyword, type, startDate, endDate, minAmount, maxAmount, currency }) }} />);
        if (startDate) tags.push(<FilterTag key="startDate" label="From" value={startDate} onClose={() => { setStartDate(""); handleSearch({ keyword, type, whoPaid, endDate, minAmount, maxAmount, currency }) }} />);
        if (endDate) tags.push(<FilterTag key="endDate" label="To" value={endDate} onClose={() => { setEndDate(""); handleSearch({ keyword, type, whoPaid, startDate, minAmount, maxAmount, currency }) }} />);
        if (minAmount > 0) tags.push(<FilterTag key="minAmount" label="Min" value={`$${minAmount}`} onClose={() => { setMinAmount(0); handleSearch({ keyword, type, whoPaid, startDate, endDate, maxAmount, currency }) }} />);
        if (maxAmount > 0) tags.push(<FilterTag key="maxAmount" label="Max" value={`$${maxAmount}`} onClose={() => { setMaxAmount(0); handleSearch({ keyword, type, whoPaid, startDate, endDate, minAmount, currency }) }} />);
        if (currency && currency !== "SGD" && (minAmount > 0 || maxAmount > 0)) tags.push(<FilterTag key="currency" label="Currency" value={`$${currency}`} onClose={() => { setCurrency("SGD"); handleSearch({ keyword, type, whoPaid, startDate, endDate, minAmount, maxAmount }) }} />);
        if (currency !== "SGD" && !keyword && !type && !whoPaid && !startDate && !endDate && minAmount <= 0 && maxAmount <= 0) { setCurrency("SGD"); handleSearch({ keyword, type, whoPaid, startDate, endDate, minAmount, maxAmount }) };

        return tags.length > 0 ? <div className="flex flex-wrap gap-2 max-w-[400px]">{tags.slice(0, 2)}</div> : null;
    };

    useEffect(() => {
        if (error) {
            setPopup(true);
            setTimeout(() => {
                setPopup(false);
                setError("");
            }, 3000);
            window.history.replaceState({}, document.title);
        }

        if (message) {
            setPopup(true);
            setTimeout(() => {
                setPopup(false);
                setMessage("");
            }, 3000);
            window.history.replaceState({}, document.title);
        }
    }, [error, message]);

    return (
        <div className="flex flex-col mb-10">
            {popup &&
                (error ? (<div className="error">{error}</div>)
                    : (<div className="error bg-[#dcf0fa] text-orange-600">{message}</div>))}
            <div className="flex mx-16 mt-10 justify-between">
                <div className="gap-4 flex items-center">
                    <div className="card-button font-semibold hover:text-black hover:bg-slate-200 text-sm" onClick={() => navigate(`/budget/${id}`)}>
                        <ion-icon name="arrow-back"></ion-icon>Back
                    </div>
                    <h5 className="text-2xl font-semibold">All Expenditure for itinerary</h5>
                </div>

                <div className="flex justify-center items-center gap-4">
                    <div className="flex items-center justify-center p-3 rounded-lg cursor-pointer">
                        <div className="flex justify-center items-center gap-2 font-semibold">
                            <p className="underline">Filter By:</p>
                            {!filter && showFiltered()}
                            <ion-icon name={filter ? "chevron-up" : "chevron-down"} onClick={() => setFilter(filter ? false : true)}></ion-icon>
                        </div>
                    </div>
                    <div className="items-center justify-center flex p-3 bg-white shadow-md text-gray-700 hover:bg-blue-50 hover:text-blue-500 cursor-pointer rounded-xl">
                        <div onClick={() => setOpenModal({ shown: true, mode: "add", data: null })} className="items-center flex gap-1">
                            <ion-icon name="logo-usd" style={{ height: "18px", width: "18px" }}></ion-icon>
                            <span className="text-sm font-semibold">Add Expenses</span>
                        </div>
                    </div>
                </div>
            </div>

            {filter && (
                <div className="bg-white rounded-xl flex mt-4 mx-16">
                    <div className="flex flex-col w-full">
                        <div className="px-5 py-3 items-start w-full">
                            <p className="text-xl font-semibold text-gray-700">Filter by:</p>
                        </div>

                        <div className="flex px-10 pb-3 gap-2 justify-between">
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-5">
                                    <h6 className="text-label">Search by keyword:</h6>
                                    <input
                                        type="text"
                                        placeholder="title or notes"
                                        name="keyword"
                                        value={keyword}
                                        autoFocus
                                        autoComplete="off"
                                        onChange={(e) => setKeyword(e.target.value)}
                                        className="text-input w-[260px]"
                                    />
                                </div>
                                <div className="flex gap-5">
                                    <h6 className="text-label">Type:</h6>
                                    <select
                                        value={type}
                                        required
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 focus:outline-none cursor-pointer"
                                    >
                                        <option disabled value="">Select type</option>
                                        {typesOfExpenses.map((expenses) => (
                                            <option key={expenses} value={expenses}>
                                                {expenses}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-5">
                                    <h6 className="text-label">Who Paid:</h6>
                                    <input
                                        type="text"
                                        placeholder="who paid"
                                        name="whoPaid"
                                        value={whoPaid}
                                        autoComplete="off"
                                        onChange={(e) => setWhoPaid(e.target.value)}
                                        className="text-input w-[336px]"
                                    />
                                </div>
                            </div>

                            <div className="border"></div>

                            <div className="flex flex-col gap-3">
                                <div className="flex">
                                    <h6 className="text-label mr-6">Date</h6>
                                    <div className="flex">
                                        <h6 className="text-label">From:</h6>
                                        <input
                                            type="date"
                                            name="startDate"
                                            max={endDate ? formatDate(endDate) : undefined}
                                            value={formatDate(startDate)}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="text-input w-[160px] mr-2 cursor-text"
                                        />
                                    </div>
                                    <div className="flex gap-7">
                                        <h6 className="text-label">To:</h6>
                                        <input
                                            type="date"
                                            name="endDate"
                                            min={startDate ? formatDate(startDate) : undefined}
                                            value={formatDate(endDate)}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="text-input w-[160px] cursor-text"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <h6 className="text-label pr-0">Amount</h6>
                                    <div className="flex gap-3">
                                        <h6 className="text-label">Min:</h6>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            name="minAmount"
                                            min={0}
                                            max={maxAmount}
                                            value={minAmount}
                                            onChange={(e) => setMinAmount(e.target.value)}
                                            className="text-input w-[160px]"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <h6 className="text-label">Max:</h6>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            name="maxAmount"
                                            min={minAmount}
                                            value={maxAmount}
                                            onChange={(e) => setMaxAmount(e.target.value)}
                                            className="text-input w-[160px]"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <div className="flex justify-center items-center">
                                        <h6 className="text-label">Currency:</h6>
                                        <input
                                            type="text"
                                            placeholder="Type or select a code"
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

                                    <div className="flex gap-3">
                                        <button onClick={() => reset()} className="px-3 py-2 w-[105px] bg-neutral-100 rounded-xl flex items-center justify-center gap-2 font-semibold cursor-pointer hover:shadow-md hover:bg-neutral-300">
                                            <ion-icon name="close-circle-outline"></ion-icon>Clear
                                        </button>
                                        <button onClick={() => validInputCheck(() => handleSearch({ keyword, type, whoPaid, startDate, endDate, minAmount, maxAmount, currency }))}
                                            className="px-3 py-2 bg-neutral-100 rounded-xl flex items-center justify-center gap-2 font-semibold cursor-pointer hover:shadow-md hover:bg-neutral-300">
                                            <ion-icon name="search"></ion-icon>Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6 mx-10 mb-8">
                {loading
                    ? <SearchLoading />
                    : filterExpenses.length > 0
                        ? <div className="grid grid-cols-3 gap-6">
                            {filterExpenses.map((entry, idx) => (
                                <ExpensesDetailedCard
                                    key={idx}
                                    data={entry}
                                    xRate={xRate}
                                    editExpenses={editExpenses}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                        : <EmptyExpenses />}
            </div>

            <Modal
                isOpen={openModal.shown}
                onRequestClose={() => setOpenModal({ shown: false, mode: "add", data: null })}
                style={{
                    overlay: {
                        background: "rgba(0,0,0,0.4)",
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                    content: {
                        position: "static",
                        inset: "unset",
                        display: "flex",
                        width: "512px",
                        height: "525px",
                        margin: "auto",
                        background: "#f8fafc",
                        padding: "10px",
                    },
                }}
                appElement={document.getElementById("root")}
            >
                <ExpensesModal
                    mode={openModal.mode}
                    data={openModal.data}
                    xRate={xRate}
                    onClose={() => setOpenModal({ shown: false, mode: "add", data: null })}
                    onAdd={onAdd}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </Modal>
        </div>
    )
}