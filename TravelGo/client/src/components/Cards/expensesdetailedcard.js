import React, { useState } from "react";
import Modal from "react-modal";
import moment from "moment/moment";

import { styleAmount } from "../../utils/helper"

export default function ExpensesDetailedCard({ data, editExpenses, xRate, onDelete }) {
    const [openModal, setOpenModal] = useState(false);

    return (
        <div className="bg-white border border-gray-200 group rounded-2xl p-4 shadow-md hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-2">
                <p className="text-md text-gray-600 w-fit">{moment(data.date).format("Do MMM YYYY")}</p>
                <span className="text-xl font-semibold text-gray-800 capitalize truncate max-w-[60%] text-right">{data.title}</span>
            </div>

            <div className="text-2xl font-bold text-blue-500 mb-2">${styleAmount(data.amount * xRate)}</div>

            <div className="flex justify-between">
                <div className="flex flex-col gap-1 text-sm text-gray-600 capitalize max-w-[80%]">
                    <p><span className="font-medium text-gray-700">Type:</span> {data.type}</p>
                    <p className="truncate line-clamp-1 whitespace-nowrap max-w-full"><span className="font-medium text-gray-700">Paid by:</span> {data.whoPaid.toLowerCase()}</p>
                    <p className="text-gray-500 line-clamp-2 max-w-full">Notes: <span className="italic lowercase">{data.notes ? `${data.notes}` : "-"}</span></p>
                </div>

                <div className="flex items-start gap-3">
                    <button onClick={() => editExpenses(data)} className="text-gray-400 grid place-items-center hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <ion-icon name="pencil" style={{ height: "24px", width: "24px" }}></ion-icon>
                    </button>
                    <button onClick={() => setOpenModal(true)} className="text-gray-400 grid place-items-center hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <ion-icon name="trash" style={{ height: "24px", width: "24px" }}></ion-icon>
                    </button>
                </div>
            </div>

            <Modal
                isOpen={openModal}
                onRequestClose={() => setOpenModal(false)}
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
                        width: "312px",
                        height: "155px",
                        margin: "auto",
                        background: "#f8fafc",
                        padding: "10px",
                    },
                }}
                appElement={document.getElementById("root")}
            >
                <div className="flex flex-col justify-center items-center h-full w-full">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Delete Expenses?</h2>
                    <div className="flex gap-5 text-xl">
                        <button onClick={() => { onDelete(data._id); setOpenModal(false); }}
                            className="bg-red-500 text-white px-4 py-2 rounded-xl w-24 hover:bg-red-600 hover:shadow-md transition">
                            Yes
                        </button>
                        <button onClick={() => setOpenModal(false)}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-xl w-24 hover:bg-gray-400 hover:shadow-md transition">
                            No
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}