import React, { useEffect, useState } from "react";

export default function ActivityLayout({
    mode, activity, date, onClose, addActivity, editActivitiy, deleteActivity }) {
    const [activityName, setActivityName] = useState(activity?.name || "");
    const [endTime, setEndTime] = useState(activity?.endTime || null);
    const [error, setError] = useState("");
    const [notes, setNotes] = useState(activity?.notes || "");
    const [popup, setPopup] = useState(false);
    const [startTime, setStartTime] = useState(activity?.startTime || null);
    const [type, setType] = useState(activity?.type || "-");

    const edit = mode === "edit";
    const typeOfActivities = ["Meal", "Shopping", "Sightseeing", "Transport", "Other"];

    useEffect(() => {
        if (error) {
            setPopup(true);
            setTimeout(() => {
                setPopup(false);
                setError("");
            }, 3000);
            window.history.replaceState({}, document.title);
        }
    }, [error]);

    return (
        <div className="flex flex-col w-full h-full">
            {popup && <div className="error">{error}</div>}
            <div className="flex items-center justify-between pl-5 pr-3 py-2">
                <h5 className="text-xl font-semibold">{edit ? "Edit Activity" : "Add Activity"}</h5>
                <div onClick={onClose} className="cursor-pointer rounded-full hover:bg-slate-200">
                    <ion-icon
                        name="close"
                        style={{
                            alignItems: "center",
                            display: "flex",
                            height: "20px",
                            width: "20px"
                        }}
                    />
                </div>
            </div>

            <div className="px-3">
                <div className="flex flex-col gap-3">
                    <h6 className="text-label">Activity Name:</h6>
                    <input
                        type="text"
                        placeholder="activity name"
                        name="name"
                        value={activityName}
                        autoComplete="off"
                        required
                        className="text-input"
                        onChange={(e) => setActivityName(e.target.value)}
                    />
                </div>
                <div className="pt-2 flex gap-5">
                    <div className="flex flex-col gap-3">
                        <h6 className="text-label">Date:</h6>
                        <input
                            type="text"
                            value={date}
                            disabled
                            className="text-input w-[142px]"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h6 className="text-label">Start Time:</h6>
                        <div className="flex">
                            <input
                                type="time"
                                name="startTime"
                                max={endTime ? endTime : undefined}
                                value={startTime}
                                required
                                className="text-input w-[142px] cursor-text"
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h6 className="text-label">End Time:</h6>
                        <div className="flex">
                            <input
                                type="time"
                                name="endTime"
                                min={startTime ? startTime : undefined}
                                value={endTime}
                                required
                                className="text-input w-[142px] cursor-text"
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex gap-5 pt-4">
                    <h6 className="text-label">Type:</h6>
                    <select
                        value={type}
                        required
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 focus:outline-none cursor-pointer"
                    >
                        <option disabled value="-">Select type</option>
                        {typeOfActivities.map((activityType) => (
                            <option key={activityType} value={activityType}>
                                {activityType}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                    <h6 className="text-label">Notes:</h6>
                    <textarea
                        type="text"
                        placeholder="notes"
                        name="notes"
                        rows={4}
                        autoComplete="off"
                        value={notes}
                        className="text-input overflow-y-scroll scrollbar"
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                {edit
                    ? <div className="flex gap-2 mt-7 w-full h-10">
                        <div onClick={(e) => {
                            e.preventDefault();
                            editActivitiy();
                        }}
                            className="itinerary-button bg-green-200 hover:bg-green-300">
                            <ion-icon name="pencil"></ion-icon>
                            Save
                        </div>
                        <div onClick={(e) => { e.preventDefault(); deleteActivity() }}
                            className="itinerary-button bg-red-200 hover:bg-red-300">
                            <ion-icon name="trash"></ion-icon>
                            Delete
                        </div>
                    </div>
                    : <div
                        onClick={(e) => {
                            e.preventDefault();
                            if (endTime <= startTime) {
                                setError("Invalid End Time");
                                setPopup(true);
                            } else {
                                addActivity({ activityName, date, startTime, endTime, type, notes });
                            }
                        }}
                        className="flex gap-2 mt-7 w-full h-10 itinerary-button bg-green-200 hover:bg-green-300">
                        <ion-icon name="pencil"></ion-icon>
                        Add
                    </div>}
            </div>
        </div>
    )
}