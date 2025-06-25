import moment from 'moment/moment';

import { styleAmount } from '../../utils/helper';
import accoms from '../../assets/accomsIcon.svg';
import activities from '../../assets/activitiesIcon.svg';
import food from '../../assets/foodIcon.svg';
import gift from '../../assets/giftIcon.svg';
import others from '../../assets/othersIcon.svg';
import shopping from '../../assets/shoppingIcon.svg';
import transport from '../../assets/transportIcon.svg';

export default function EventInfoCard({ title, date, amount, type, hideDelete }) {
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

    const onDelete = () => { };

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
                    {!hideDelete && (
                        <button className="text-gray-400 grid place-items-center hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={onDelete}>
                            <ion-icon name="trash" style={{ height: "24px", width: "24px" }}></ion-icon>
                        </button>
                    )}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 text-blue-500">
                        <h6 className="text-md font-semibold">${styleAmount(amount)}</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}