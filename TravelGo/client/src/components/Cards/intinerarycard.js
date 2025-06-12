import moment from 'moment/moment';

export default function ItineraryCard({
    destination,
    imageUrl,
    startDate,
    endDate,
    numberOfPeople,
    notes,
    onClick
}) {
    const parsedStartDate = moment(startDate).format("Do MMM YYYY");
    const parsedEndDate = moment(endDate).format("Do MMM YYYY");

    return (
        <div className="border rounded-lg overflow-hidden bg-mint-green hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer">
            <img src={imageUrl} alt={destination} className='w-full h-48 object-cover rounded-lg' />
            <div className="p-4 flex items-center gap-3" onClick={onClick}>
                <div className="flex-1">
                    <h6 className="text-md font-semibold">{destination}</h6>
                    <span className="text-xs text-slate-500">
                        {parsedStartDate} - {parsedEndDate}
                    </span>
                    <p className="text-xs text-slate-600 mt-2">Number Of People: {numberOfPeople}</p>
                    <p className="text-xs text-slate-600 mt-2">{notes}</p>
                </div>
            </div>
        </div>
    )
}