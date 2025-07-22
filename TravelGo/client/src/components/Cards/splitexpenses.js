import { useEffect, useState } from "react";
import Modal from "react-modal";

import EmptyExpenses from "./emptyexpenses";
import SearchLoading from "../Loading/searchloading";
import SplitExpensesInfoCard from "./splitexpensesinfocard";
import SplitExpensesModal from "../Modals/splitexpensesmodal";

export default function SplitExpenses({ totalExpenses, splitExpenses, xRate }) {
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState({ shown: false, data: null });

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [splitExpenses]);

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Split Expenses</h5>
                {splitExpenses?.settlement?.length > 0 &&
                    <button className="card-button" onClick={() => setOpenModal({ shown: true, data: splitExpenses })}>
                        Show More <ion-icon name="arrow-forward"></ion-icon>
                    </button>}
            </div>

            <div className="mt-6">
                {loading
                    ? <SearchLoading />
                    : splitExpenses?.settlement?.length > 0
                        ? splitExpenses?.settlement?.slice(0, 4).map((entry, idx) => (
                            <SplitExpensesInfoCard
                                key={idx}
                                from={entry.from}
                                to={entry.to}
                                amount={entry.amount * xRate}
                            />
                        ))
                        : <EmptyExpenses />}
            </div>

            <Modal
                isOpen={openModal.shown}
                onRequestClose={() => setOpenModal({ shown: false, data: null })}
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
                        height: "620px",
                        margin: "auto",
                        background: "#f8fafc",
                        padding: "10px",
                    },
                }}
                appElement={document.getElementById("root")}
            >
                <SplitExpensesModal
                    data={openModal.data}
                    totalExpenses={totalExpenses}
                    xRate={xRate}
                    onClose={() => setOpenModal({ shown: false, data: null })}
                />
            </Modal>
        </div>
    )
}