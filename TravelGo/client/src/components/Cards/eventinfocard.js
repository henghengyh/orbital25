import { useState } from 'react';
import Modal from 'react-modal';
import moment from 'moment/moment';

import { styleAmount } from '../../utils/helper';
import accoms from '../../assets/accomsIcon.svg';
import activities from '../../assets/activitiesIcon.svg';
import food from '../../assets/foodIcon.svg';
import gift from '../../assets/giftIcon.svg';
import others from '../../assets/othersIcon.svg';
import shopping from '../../assets/shoppingIcon.svg';
import transport from '../../assets/transportIcon.svg';

export default function EventInfoCard({ id, title, date, amount, type, onDelete }) {
    const [openModal, setOpenModal] = useState(false);

    const iconImg = (type) => {
        if (type === "accommodation") return accoms;
        else if (type === "activities") return activities;
        else if (type === "food") return food;
        else if (type === "gift") return gift;
        else if (type === "others") return others;
        else if (type === "shopping") return shopping;
        else if (type === "transport") return transport;
        else return null;
    }

    return (
        <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/50">
            <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
                <img src={iconImg(type)} alt={type} className="w-6 h-6" />
            </div>

            <div className="flex flex-1 items-center justify-between">
                <div>
                    <p className="text-sm text-gray-700 font-medium">{title}</p>
                    <p className="text-xs text-gray-400 mt-1">{moment(date).format("Do MMM YYYY")}</p>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setOpenModal(true)} className="text-gray-400 grid place-items-center hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <ion-icon name="trash" style={{ height: "24px", width: "24px" }}></ion-icon>
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 text-blue-500">
                        <h6 className="text-md font-semibold">${styleAmount(amount)}</h6>
                    </div>
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
                        <button onClick={() => {onDelete(id); setOpenModal(false);}}
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