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

export default function ExpensesInfoCard({ data, xRate, editExpenses, onDelete }) {
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
                <img src={iconImg(data.type)} alt={data.type} className="w-6 h-6" />
            </div>

            <div className="flex flex-1 items-center justify-between max-w-[86%]">
                <div className='max-w-[50%]'>
                    <p className="text-sm text-gray-700 font-medium line-clamp-1 max-w-full">{data.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{moment(data.date).format("Do MMM YYYY")}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => editExpenses(data)} className="text-gray-400 grid place-items-center hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <ion-icon name="pencil" style={{ height: "24px", width: "24px" }}></ion-icon>
                    </button>
                    <button onClick={() => setOpenModal(true)} className="text-gray-400 grid place-items-center hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <ion-icon name="trash" style={{ height: "24px", width: "24px" }}></ion-icon>
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 text-blue-500">
                        <h6 className="text-md font-semibold">${styleAmount(data.amount * xRate)}</h6>
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
                        width: "335px",
                        height: "170px",
                        margin: "auto",
                        background: "#f8fafc",
                        padding: "10px",
                    },
                }}
                appElement={document.getElementById("root")}
            >
                <div className="flex flex-col justify-center h-full w-full p-2">
                    <h2 className="text-xl font-bold mb-2">Confirm Delete</h2>
                    <p className="mb-4 text-lg">Are you sure you want to delete?</p>
                    <div className="flex justify-between items-center text-lg">
                        <button onClick={() => setOpenModal(false)}
                            className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 hover:shadow-md transition">
                            Cancel
                        </button>
                        <button onClick={() => { onDelete(data._id); setOpenModal(false); }}
                            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 hover:shadow-md transition">
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}