import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-modal";

import { styleAmount } from "../../utils/helper";
import AllExpenses from "../Cards/allexpenses";
import axiosInstance from "../../utils/axiosInstance";
import BudgetModal from "../Modals/budgetmodal";
import CurrencyModal from "../Modals/currencymodal";
import ExpensesOverview from "../Cards/expensesoverview";
import LatestEvents from "../Cards/lastestevents";
import WeeklyOverview from "../Cards/weeklyoverview";

export default function BudgetLayout() {
    const [budget, setBudget] = useState(0);
    const [color, setColor] = useState({ container: null, title: null, amount: null });
    const [currency, setCurrency] = useState("SGD");
    const [latestExpenses, setLatestExpenses] = useState([]);
    const [openModal, setOpenModal] = useState({ shown: false, type: "budget", data: null });
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [remainingAmount, setRemainingAmount] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [weeklyOverview, setWeeklyOverview] = useState([]);

    const { id } = useParams();

    const totalSum = (allExpenses) => allExpenses.reduce((total, curr) => total + curr.amount, 0);

    useEffect(() => {
        axiosInstance
            .get(`/budget/${id}`)
            .then((res) => setBudget(res.data.budget?.[0].budget))
            .catch((err) => (console.error(err.error)));

        axiosInstance
            .get(`/expenses/${id}/all-expenses`)
            .then(res => setTotalExpenses(totalSum(res.data.allExpenses)))
            .catch(err => console.error(err.error));
    });

    useEffect(() => {
        setRemainingAmount(budget - totalExpenses);
    }, [budget, totalExpenses]);

    useEffect(() => {
        if (remainingAmount > 500) setColor({ container: "bg-green-50", title: "text-green-700", amount: "text-green-800" })
        else if (remainingAmount > 0) setColor({ container: "bg-yellow-100", title: "text-yellow-700", amount: "text-yellow-800" })
        else setColor({ container: "bg-red-50", title: "text-red-700", amount: "text-red-800" });
    }, [remainingAmount]);

    useEffect(() => {
        axiosInstance
            .get(`/expenses/${id}/recent-expenses`)
            .then(res => setRecentExpenses(res.data?.recentExpenses))
            .catch(err => console.error(err.error));

        axiosInstance
            .get(`/expenses/${id}/weekly-overview`)
            .then(res => setWeeklyOverview(res.data?.weeklyOverview))
            .catch(err => console.error(err.error));

        axiosInstance
            .get(`/expenses/${id}/latest-expenses`)
            .then(res => setLatestExpenses(res.data?.latestExpenses))
            .catch(err => console.error(err.error));
    }, [totalExpenses, id]);

    const onDelete = (expensesId) => {
        console.log('hi');
        let deletedAmt = 0;
        axiosInstance
            .get(`/expenses/${id}/${expensesId}`)
            .then(res => deletedAmt = res.data.expenses.amount)
            .catch(err => console.error(err.error));

        axiosInstance
            .delete(`/expenses/${id}/${expensesId}`)
            .then(res => setTotalExpenses(totalExpenses - deletedAmt))
            .catch(err => console.error(err.error));
    }

    const seeMore = () => { }

    return (
        <div className="flex flex-col mb-10">
            <div className="flex justify-between items-center min-h-[20vh] p-6">
                <div onSubmit={() => setOpenModal({ shown: true, type: "currency", data: currency })}
                    className="ml-8 flex flex-col items-center group text-gray-700">
                    <p className="text-center font-semibold mb-1">Current Currency:</p>
                    <div className="text-2xl font-semibold gap-3 flex">{currency.toUpperCase()}
                        <span onClick={() => setOpenModal({ shown: true, type: "currency", data: currency })}
                            className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <ion-icon name="pencil" style={{ height: "20px", width: "20px" }}></ion-icon>
                        </span>
                    </div>
                </div>

                <div className="flex justify-center items-center">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-6 rounded-xl shadow-md group">
                            <h3 className="text-lg font-semibold text-blue-700 mb-2">
                                Total Budget:
                            </h3>
                            <div className="flex gap-4 items-center">
                                <p className="text-xl font-bold text-blue-800">${styleAmount(budget)}</p>
                                <span onClick={() => setOpenModal({ shown: true, type: "budget", data: budget })}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <ion-icon name="pencil"></ion-icon>
                                </span>
                            </div>
                        </div>
                        <div className="bg-red-50 p-6 rounded-xl shadow-md">
                            <h3 className="text-lg font-semibold text-red-700 mb-2">
                                Total Expenses:
                            </h3>
                            <p className="text-xl font-bold text-red-800">${styleAmount(totalExpenses)}</p>
                        </div>
                        <div className={`${color.container} p-6 rounded-xl shadow-md`}>
                            <h3 className={`${color.title} text-lg font-semibold mb-2`}>
                                Remaining Amount:
                            </h3>
                            <p className={`${color.amount} text-xl font-bold`}>${styleAmount(remainingAmount)}</p>
                        </div>
                    </div>
                </div>

                <div className="mr-10 items-center justify-center flex p-4 bg-white shadow-md text-gray-700 hover:bg-purple-50 hover:text-purple-500 cursor-pointer rounded-xl">
                    <div className="items-center flex gap-1">
                        <ion-icon name="logo-usd" style={{ height: "20px", width: "20px" }}></ion-icon>
                        <span className="text-md font-semibold">Add Expenses</span>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={openModal.shown}
                onRequestClose={() => setOpenModal({ shown: false, type: "budget", data: null })}
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
                        height: "255px",
                        margin: "auto",
                        background: "#f8fafc",
                        padding: "10px",
                    },
                }}
                appElement={document.getElementById("root")}
            >
                {openModal.type === "budget"
                    ? <BudgetModal
                        type={openModal.type}
                        data={openModal.data}
                        onClose={() => setOpenModal({ shown: false, type: "budget", data: null })}
                        setBudget={setBudget}
                    />
                    : <CurrencyModal
                        type={openModal.type}
                        data={openModal.data}
                        onClose={() => setOpenModal({ shown: false, type: "budget", data: null })}
                        setCurrency={setCurrency}
                    />}
            </Modal>

            <div className="grid grid-cols-2 gap-6 mx-20 mb-10">
                <ExpensesOverview
                    budget={budget}
                    totalExpenses={totalExpenses}
                    remainingAmount={remainingAmount}
                />
                <LatestEvents recentExpenses={recentExpenses} onDelete={onDelete} />
                <WeeklyOverview weeklyOverview={weeklyOverview} />
                <AllExpenses latestExpenses={latestExpenses} onDelete={onDelete} seeMore={seeMore} />
            </div>
        </div>
    )
}