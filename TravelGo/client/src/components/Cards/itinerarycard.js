import moment from 'moment/moment';

import { imageList } from './itineraryimage';

export default function ItineraryCard({
    destination,
    tripName,
    imageNumber,
    startDate,
    endDate,
    numberOfPeople,
    onClick
}) {
    const parsedStartDate = moment(startDate).format("Do MMM YYYY");
    const parsedEndDate = moment(endDate).format("Do MMM YYYY");

    return (
        <div onClick={onClick} className="border rounded-lg overflow-hidden bg-mint-green hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer">
            <img src={imageList[imageNumber - 1]} alt={destination} className='w-full h-48 object-cover rounded-lg' />
            <div className="p-4 flex items-center gap-3">
                <div className="flex-1">
                    <h6 className="text-md font-semibold capitalize line-clamp-1">{tripName}</h6>
                    <span className="text-sm font-semibold">{destination}</span>
                    <span className="text-xs ml-5">
                        {parsedStartDate} - {parsedEndDate}
                    </span>
                    <p className="text-xs text-slate-600 mt-1">Number Of People: {numberOfPeople}</p>
                </div>
            </div>
        </div>
    )
}