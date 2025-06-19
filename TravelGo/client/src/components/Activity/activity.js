import React from "react";

export default function Activity({ activityName, startTime, endTime, type, onClick }) {
    return (
        <div className="bg-zinc-200 flex rounded h-[60px] p-2 flex-col group shadow-sm">
            <div className="flex flex-row justify-between h-6">
                <p className="font-medium w-[200px] overflow-hidden">{activityName}</p>
                <div onClick={onClick} className="hidden justify-center items-center rounded p-1 hover:bg-zinc-300 cursor-pointer group-hover:inline">
                    <ion-icon name="pencil"></ion-icon>
                </div>
            </div>

            <p className="text-sm font-light text-slate-500">
                {startTime} - {endTime}
                <span className="ml-3">{type}</span>
            </p>
        </div>
    )
}