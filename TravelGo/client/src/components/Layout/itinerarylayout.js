import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ActivityCard from "../Activity/activitycard";
import EmptyActivity from "../Cards/emptyactivity";

export default function ItineraryLayout({ mode, itinerary, addItinerary, editItinerary, deleteItinerary }) {
    const [activities, setActivities] = useState(itinerary?.activities || []);
    const [dates, setDates] = useState([]);
    const [destination, setDestination] = useState(itinerary?.destination || "");
    const [endDate, setEndDate] = useState(itinerary?.endDate || null);
    const [tripName, setTripName] = useState(itinerary?.tripName || "");
    const [notes, setNotes] = useState(itinerary?.notes || "");
    const [numberOfPeople, setNumberOfPeople] = useState(itinerary?.numberOfPeople || 1);
    const [startDate, setStartDate] = useState(itinerary?.startDate || null);

    const navigate = useNavigate();

    const edit = mode === "edit";

    const formatDate = (date) => {
        if (!date) return "";
        return date.slice(0, 10);
    }

    const dateRange = (startDate, endDate) => {
        if (!startDate || !endDate) return [];

        const dates = [];
        let curr = new Date(startDate);
        while (curr <= new Date(endDate)) {
            dates.push(curr.toISOString().slice(0, 10));
            curr.setDate(curr.getDate() + 1);
        }
        return dates;
    }

    useEffect(() => {
        setDates(dateRange(startDate, endDate));
    }, [startDate, endDate]);

    return (
        <div className="flex flex-col h-[500px] bg-white shadow-xl rounded-xl border-2">
            <div className="flex items-center justify-between pl-6 pr-4 py-3">
                <h5 className="text-xl font-semibold">{edit ? "Edit Itinerary" : "Add Itinerary"}</h5>
                <div onClick={() => navigate('/dashboard')} className="cursor-pointer rounded-full hover:bg-slate-200">
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

            <div className="flex gap-7 h-[444px] pb-4">
                <div className="w-[320px] pl-4">
                    <div>
                        <div className="flex flex-col gap-2">
                            <h6 className="text-label">Trip Name:</h6>
                            <input
                                type="text"
                                placeholder="trip name"
                                name="tripName"
                                value={tripName}
                                autoComplete="off"
                                required
                                className="text-input"
                                onChange={(e) => setTripName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                            <h6 className="text-label">Destination:</h6>
                            <input
                                type="text"
                                placeholder="destination"
                                name="destination"
                                value={destination}
                                autoComplete="off"
                                required
                                className="text-input"
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>
                        <div className="pt-2 flex gap-3">
                            <div className="flex flex-col gap-2">
                                <h6 className="text-label">From:</h6>
                                <div className="flex">
                                    <input
                                        type="date"
                                        name="startDate"
                                        max={endDate ? endDate : undefined}
                                        value={formatDate(startDate)}
                                        required
                                        className="text-input w-[146px] cursor-text"
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h6 className="text-label">To:</h6>
                                <div className="flex">
                                    <input
                                        type="date"
                                        name="endDate"
                                        min={startDate ? startDate : undefined}
                                        value={formatDate(endDate)}
                                        required
                                        className="text-input w-[146px] cursor-text"
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <h6 className="text-label">Number of people:</h6>
                            <input
                                type="number"
                                placeholder="1"
                                min="1"
                                name="numberOfPeople"
                                autoComplete="off"
                                value={numberOfPeople}
                                className="text-sm bg-off-white px-3 py-2 rounded w-16"
                                onChange={(e) => setNumberOfPeople(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h6 className="text-label">Notes:</h6>
                            <textarea
                                type="text"
                                placeholder="notes"
                                name="notes"
                                rows={3}
                                autoComplete="off"
                                value={notes}
                                className="text-input overflow-y-scroll scrollbar"
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    {edit
                        ? <div className="flex gap-2 absolute bottom-[54px] w-[304px] h-9">
                            <div onClick={(e) => {
                                e.preventDefault();
                                editItinerary({ tripName, destination, startDate, endDate, numberOfPeople, notes });
                            }}
                                className="itinerary-button bg-green-100 hover:bg-green-200">
                                <ion-icon name="pencil"></ion-icon>
                                Save
                            </div>
                            <div onClick={(e) => { e.preventDefault(); deleteItinerary(); }}
                                className="itinerary-button bg-red-100 hover:bg-red-200">
                                <ion-icon name="trash"></ion-icon>
                                Delete
                            </div>
                        </div>
                        : <div
                            onClick={(e) => {
                                e.preventDefault();
                                addItinerary({ tripName, destination, startDate, endDate, numberOfPeople, notes });
                            }}
                            className="flex gap-2 absolute bottom-[54px] w-[304px] h-9 itinerary-button bg-green-100 hover:bg-green-200">
                            <ion-icon name="pencil"></ion-icon>
                            Add
                        </div>}
                </div>

                <div className="w-[816px] pr-4">
                    <div className="flex flex-row gap-2 px-1 overflow-x-scroll scrollbar border-slate-300 rounded bg-gray-300">
                        {dates.length > 0
                            ? dates.map((date, idx) => (
                                <ActivityCard key={idx} date={date} activities={activities} />
                            ))
                            : <EmptyActivity dateSelected={false} />}
                    </div>
                </div>
            </div>
        </div>
    )
}