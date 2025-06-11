import noItinerary from '../../assets/noItinerary.png';

export default function EmptyCard() {
    return (
        <div className="flex flex-col items-center justify-center mt-20">
            <img src={noItinerary} alt="No Itinerary" className="w-24" />
            <p className="w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5">
                Click the '+' button to start creating your itinerary.
            </p>
        </div>
    )
}