import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";

import axiosInstance from "../../utils/axiosInstance";
import ExpensesDetailedCard from "../../components/Cards/expensesdetailedcard";
import ExpensesModal from "../../components/Modals/expensesmodal";

export default function AllExpenditure() {
    const [allExpenses, setAllExpenses] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [openModal, setOpenModal] = useState({ shown: false, mode: "add", data: null });
    const [popup, setPopup] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    const fetchAllExpenses = useCallback(() => {
        axiosInstance
            .get(`/expenses/${id}/all-expenses`)
            .then(res => setAllExpenses(res.data.allExpenses))
            .catch(err => console.error(err.error));
    }, [id]);

    useEffect(() => {
        fetchAllExpenses();
    }, [fetchAllExpenses]);

    const onAdd = (data) => {
        axiosInstance
            .post(`/expenses/${id}`, data)
            .then(res => { setMessage(res.data.message); fetchAllExpenses(); })
            .catch(err => { console.error(err); setError(err.response.data.error); })
            .finally(() => setOpenModal({ shown: false, mode: "budget", data: null }));
    };

    const editExpenses = (data) => setOpenModal({ shown: true, mode: "edit", data: data });

    const onEdit = (expensesId, data) => {
        axiosInstance
            .put(`/expenses/${id}/${expensesId}`, { ...data })
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

                <div className="items-center justify-center flex p-3 bg-white shadow-md text-gray-700 hover:bg-blue-50 hover:text-blue-500 cursor-pointer rounded-xl">
                    <div onClick={() => setOpenModal({ shown: true, mode: "add", data: null })} className="items-center flex gap-1">
                        <ion-icon name="logo-usd" style={{ height: "18px", width: "18px" }}></ion-icon>
                        <span className="text-sm font-semibold">Add Expenses</span>
                    </div>
                </div>
            </div>

            <div className="p-6 mx-10 mb-8">
                <div className="grid grid-cols-3 gap-6">
                    {allExpenses.map((entry, idx) => (
                        <ExpensesDetailedCard
                            key={idx}
                            data={entry}
                            editExpenses={editExpenses}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
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
                        height: "505px",
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
                    onClose={() => setOpenModal({ shown: false, mode: "add", data: null })}
                    onAdd={onAdd}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </Modal>
        </div>
    )
}