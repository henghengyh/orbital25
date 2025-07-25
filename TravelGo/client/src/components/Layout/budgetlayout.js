import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";

import { convertToSGD, styleAmount } from "../../utils/helper";
import AllExpenses from "../Cards/allexpenses";
import axiosInstance from "../../utils/axiosInstance";
import BudgetModal from "../Modals/budgetmodal";
import CurrencyModal from "../Modals/currencymodal";
import ExpensesBreakdown from "../Cards/expensesbreakdown";
import ExpensesModal from "../Modals/expensesmodal";
import ExpensesOverview from "../Cards/expensesoverview";
import ItineraryModal from "../Modals/itinerarymodal";
import RecentExpenses from "../Cards/recentexpenses";
import SplitExpenses from "../Cards/splitexpenses";
import WeeklyOverview from "../Cards/weeklyoverview";

export default function BudgetLayout() {
    const [breakdown, setBreakdown] = useState([]);
    const [budget, setBudget] = useState(0);
    const [color, setColor] = useState({ container: null, title: null, amount: null });
    const [currency, setCurrency] = useState("SGD");
    const [error, setError] = useState("");
    const [itineraryTitle, setItineraryTitle] = useState("");
    const [latestExpenses, setLatestExpenses] = useState([]);
    const [message, setMessage] = useState("");
    const [openModal, setOpenModal] = useState({ shown: false, mode: "budget", data: null });
    const [popup, setPopup] = useState(false);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [remainingAmount, setRemainingAmount] = useState(0);
    const [splitExpenses, setSplitExpenses] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [weeklyOverview, setWeeklyOverview] = useState([]);
    const [xRate, setXRate] = useState(1.0);

    const { id } = useParams();
    const navigate = useNavigate();

    const totalSum = (allExpenses) => allExpenses.reduce((total, curr) => total + curr.amount, 0);

    useEffect(() => {
        axiosInstance
            .get(`/budget/${id}`)
            .then(res => { setItineraryTitle(res.data.budget?.[0].itineraryTitle); setBudget(res.data.budget?.[0].budget) })
            .catch(err => console.error("Error getting budget:", err.response?.data?.message || "Something went wrong"));

        axiosInstance
            .get(`/expenses/${id}/all-expenses`)
            .then(res => setTotalExpenses(totalSum(res.data.allExpenses)))
            .catch(err => console.error("Error getting all expenses:", err.response?.data?.error || "Something went wrong"));
    }, [id]);

    const changeItinerary = (id) => {
        axiosInstance
            .get(`/budget/${id}`)
            .then(res => {
                if (res.data?.budget?.[0]?.budget) navigate(`/budget/${id}`)
                else navigate('/budget');
            })
            .catch(err => console.error("Error checking if budget is set for this itinerary:", err.response?.data?.message || "Something went wrong"))
            .finally(() => setOpenModal({ shown: false, mode: "add", data: null }));
    };

    const editBudget = (amt) => {
        axiosInstance
            .put(`/budget/${id}`, amt)
            .then(res => { setBudget(res.data.budget); setMessage(res.data.message); })
            .catch(err => {
                console.error("Error updating budget", err.response?.data?.error || "Something went wrong");
                setError(err.response?.data?.error);
            })
            .finally(() => setOpenModal({ shown: false, mode: "budget", data: null }));
    };

    useEffect(() => {
        setRemainingAmount(budget - totalExpenses);
    }, [budget, totalExpenses]);

    useEffect(() => {
        if (remainingAmount > 500) setColor({ container: "bg-green-50", title: "text-green-700", amount: "text-green-800" })
        else if (remainingAmount > 0) setColor({ container: "bg-yellow-100", title: "text-yellow-700", amount: "text-yellow-800" })
        else setColor({ container: "bg-red-50", title: "text-red-700", amount: "text-red-800" });
    }, [remainingAmount]);

    const fetchExpensesInfo = useCallback(() => {
        axiosInstance
            .get(`/expenses/${id}/recent-expenses`)
            .then(res => setRecentExpenses(res.data?.recentExpenses))
            .catch(err => console.error("Error getting recent expenses", err.response?.data?.error || "Something went wrong"));

        axiosInstance
            .get(`/expenses/${id}/weekly-overview`)
            .then(res => setWeeklyOverview(res.data?.weeklyOverview))
            .catch(err => console.error("Error getting weekly overview:", err.response?.data?.error || "Something went wrong"));

        axiosInstance
            .get(`/expenses/${id}/latest-expenses`)
            .then(res => setLatestExpenses(res.data?.latestExpenses))
            .catch(err => console.error("Error getting latest expenses:", err.response?.data?.error || "Something went wrong"));

        axiosInstance
            .get(`/expenses/${id}/expenses-breakdown`)
            .then(res => setBreakdown(res.data?.expensesBreakdown))
            .catch(err => console.error("Error getting expenses breakdown:", err.response?.data?.error || "Something went wrong"));

        axiosInstance
            .get(`/expenses/${id}/split-expenses`)
            .then(res => setSplitExpenses(res.data?.splitExpenses))
            .catch(err => console.error("Error getting split expenses:", err.response?.data?.error || "Something went wrong"));
    }, [id]);

    useEffect(() => {
        fetchExpensesInfo();
    }, [fetchExpensesInfo]);

    const onAdd = async (data) => {
        axiosInstance
            .post(`/expenses/${id}`, { ...data, amount: await convertToSGD(data.amount, data.currency) })
            .then(res => {
                setTotalExpenses(totalExpenses + res.data.newExpenses.amount);
                setMessage(res.data.message);
                fetchExpensesInfo();
            })
            .catch(err => {
                console.error("Error adding expenses:", err.response?.data?.error || "Something went wrong");
                setError(err.response?.data?.error);
            })
            .finally(() => setOpenModal({ shown: false, mode: "budget", data: null }));
    };

    const editExpenses = (data) => setOpenModal({ shown: true, mode: "edit", data: data });

    const onEdit = async (expensesId, data) => {
        axiosInstance
            .put(`/expenses/${id}/${expensesId}`, { ...data, amount: await convertToSGD(data.amount, data.currency) })
            .then(res => {
                setTotalExpenses(totalExpenses + res.data.amount);
                setMessage(res.data.message);
                fetchExpensesInfo();
            })
            .catch(err => {
                console.error("Error updating expenses:", err.response?.data?.error || "Something went wrong");
                setError(err.response?.data?.error);
            })
            .finally(() => setOpenModal({ shown: false, mode: "budget", data: null }));
    };

    const onDelete = (expensesId) => {
        axiosInstance
            .delete(`/expenses/${id}/${expensesId}`)
            .then(res => {
                setTotalExpenses(totalExpenses - res.data.amount);
                setMessage(res.data.message);
                fetchExpensesInfo();
            })
            .catch(err => {
                console.error("Error deleting expenses:", err.response?.data?.error || "Something went wrong");
                setError(err.response?.data?.error);
            })
            .finally(() => setOpenModal({ shown: false, mode: "budget", data: null }));
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
            <div className="flex justify-between items-center min-h-[20vh] p-6">
                <div className="ml-6 flex flex-col text-left text-gray-700 max-w-[245px]">
                    <div className="flex gap-2 mb-2 max-w-full group">
                        <p className="text-lg">Itinerary:</p>
                        <div className="text-lg font-semibold gap-1 flex">
                            <span className="line-clamp-1 max-w-[130px]">{itineraryTitle}</span>
                            <span onClick={() => setOpenModal({ shown: true, mode: "itinerary", data: null })}
                                className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <ion-icon data-testid="change itinerary" name="chevron-down" style={{ height: "20px", width: "20px" }}></ion-icon>
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2 items-center justify-left group">
                        <p className="text-lg">Current Currency:</p>
                        <div className="text-2xl font-semibold gap-1 flex">{currency.toUpperCase()}
                            <span onClick={() => setOpenModal({ shown: true, mode: "currency", data: currency })}
                                className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <ion-icon data-testid="change currency" name="chevron-down" style={{ height: "20px", width: "20px" }}></ion-icon>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-6 rounded-xl shadow-md group">
                            <h3 className="text-lg font-semibold text-blue-700 mb-2">
                                Total Budget:
                            </h3>
                            <div className="flex gap-4 items-center">
                                <p className="text-xl font-bold text-blue-800">${styleAmount(budget * xRate)}</p>
                                <span onClick={() => setOpenModal({ shown: true, mode: "budget", data: budget })}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <ion-icon name="pencil"></ion-icon>
                                </span>
                            </div>
                        </div>
                        <div className="bg-red-50 p-6 rounded-xl shadow-md">
                            <h3 className="text-lg font-semibold text-red-700 mb-2">
                                Total Expenses:
                            </h3>
                            <p className="text-xl font-bold text-red-800">${styleAmount(totalExpenses * xRate)}</p>
                        </div>
                        <div className={`${color.container} p-6 rounded-xl shadow-md`}>
                            <h3 className={`${color.title} text-lg font-semibold mb-2`}>
                                Remaining Amount:
                            </h3>
                            <p className={`${color.amount} text-xl font-bold`}>${styleAmount(remainingAmount * xRate)}</p>
                        </div>
                    </div>
                </div>

                <div onClick={() => setOpenModal({ shown: true, mode: "add", data: null })}
                    className="mr-6 items-center justify-center flex p-4 bg-white shadow-md text-gray-700 hover:bg-purple-50 hover:text-purple-500 cursor-pointer rounded-xl">
                    <button className="items-center flex gap-1">
                        <ion-icon name="logo-usd" style={{ height: "20px", width: "20px" }}></ion-icon>
                        <span className="text-md font-semibold">Add Expenses</span>
                    </button>
                </div>
            </div>

            <Modal
                isOpen={openModal.shown}
                onRequestClose={() => setOpenModal({ shown: false, mode: "budget", data: null })}
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
                        width: openModal.mode === "itinerary" ? "450px" : "512px",
                        height: openModal.mode === "add" || openModal.mode === "edit" ? "525px" : "255px",
                        margin: "auto",
                        background: "#f8fafc",
                        padding: "10px",
                    },
                }}
                appElement={document.getElementById("root")}
            >
                {openModal.mode === "budget"
                    ? <BudgetModal
                        data={openModal.data}
                        onClose={() => setOpenModal({ shown: false, mode: "budget", data: null })}
                        setBudget={editBudget}
                    />
                    : openModal.mode === "currency"
                        ? <CurrencyModal
                            data={openModal.data}
                            onClose={() => setOpenModal({ shown: false, mode: "budget", data: null })}
                            setCurrency={setCurrency}
                            setXRate={setXRate}
                        />
                        : openModal.mode === "itinerary"
                            ? <ItineraryModal
                                chosen={id}
                                onClose={() => setOpenModal({ shown: false, mode: "budget", data: null })}
                                changeItinerary={changeItinerary}
                            />
                            : <ExpensesModal
                                mode={openModal.mode}
                                data={openModal.data}
                                xRate={xRate}
                                onClose={() => setOpenModal({ shown: false, mode: "budget", data: null })}
                                onAdd={onAdd}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />}
            </Modal>

            <div className="grid grid-cols-2 gap-6 mx-20 mb-10">
                <ExpensesOverview
                    totalExpenses={totalExpenses * xRate}
                    remainingAmount={remainingAmount * xRate}
                />
                <RecentExpenses
                    recentExpenses={recentExpenses}
                    xRate={xRate}
                    editExpenses={editExpenses}
                    onDelete={onDelete}
                />
                <WeeklyOverview weeklyOverview={weeklyOverview} xRate={xRate} />
                <AllExpenses
                    latestExpenses={latestExpenses}
                    xRate={xRate}
                    editExpenses={editExpenses}
                    onDelete={onDelete}
                    showMore={() => navigate(`/budget/${id}/${xRate}/all-expenditure`)}
                />
                <ExpensesBreakdown totalExpenses={totalExpenses * xRate} breakdown={breakdown} xRate={xRate} />
                <SplitExpenses totalExpenses={totalExpenses * xRate} splitExpenses={splitExpenses} xRate={xRate} />
            </div>
        </div>
    )
}