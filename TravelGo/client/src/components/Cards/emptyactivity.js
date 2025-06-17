import noActivity from '../../assets/emptyActivity.png';

export default function EmptyActivity({ dateSelected }) {
    const falseStyle = "flex flex-col items-center justify-center h-[424px] w-full";

    return (
        <div className={dateSelected ? "flex flex-col items-center justify-center h-[380px]" : falseStyle}>
            <img src={noActivity} alt="No Activity" className={dateSelected ? "w-16" : "w-24"} />
            <p className="w-3/4 text-sm font-medium text-slate-700 text-center leading-7 mt-5">
                {dateSelected
                    ? "Click the '+ Add' button to start adding your activity."
                    : "Please selected the start and end dates to start adding activities for your itinerary."}
            </p>
        </div>
    )
}