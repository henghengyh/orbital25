import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ItineraryLayout({ mode, itinerary }) {
    const [destination, setDestination] = useState(itinerary?.destination || "");
    const [end, setEnd] = useState(itinerary?.endDate || null);
    const [name, setName] = useState(itinerary?.tripName || "");
    const [notes, setNotes] = useState(itinerary?.notes || "");
    const [people, setPeople] = useState(itinerary?.numberOfPeople || 1);
    const [start, setStart] = useState(itinerary?.startDate || null);

    const navigate = useNavigate();

    const create = mode === "create";
    const edit = mode === "edit";

    const formatDate = (date) => {
        if (!date) return "";
        return date.slice(0, 10);
    }

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
                                name="trip name"
                                value={name}
                                required
                                className="text-input"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                            <h6 className="text-label">Destination:</h6>
                            <input
                                type="text"
                                placeholder="destination"
                                name="destination"
                                value={destination}
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
                                        name="start"
                                        placeholder="dd/mm/yyyy"
                                        max={end ? end : undefined}
                                        value={formatDate(start)}
                                        className="text-input w-[146px] cursor-text"
                                        onChange={(e) => setStart(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h6 className="text-label">To:</h6>
                                <div className="flex">
                                    <input
                                        type="date"
                                        name="end"
                                        placeholder="dd/mm/yyyy"
                                        min={start ? start : undefined}
                                        value={formatDate(end)}
                                        className="text-input w-[146px] cursor-text"
                                        onChange={(e) => setEnd(e.target.value)}
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
                                name="people"
                                value={people}
                                className="text-sm bg-off-white px-3 py-2 rounded w-16"
                                onChange={(e) => setPeople(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h6 className="text-label">Notes:</h6>
                            <textarea
                                type="text"
                                placeholder="notes"
                                name="notes"
                                rows={3}
                                value={notes}
                                className="text-input overflow-y-scroll scrollbar"
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    {edit
                        ? <div className="flex gap-2 absolute bottom-[54px] w-[304px] h-9">
                            <button className="itinerary-button bg-green-100 hover:bg-green-200">
                                <ion-icon name="pencil"></ion-icon>
                                Save
                            </button>
                            <button className="itinerary-button bg-red-100 hover:bg-red-200">
                                <ion-icon name="trash"></ion-icon>
                                Delete
                            </button>
                        </div>
                        : <div className="flex gap-2 absolute bottom-[54px] w-[304px] h-9">
                            <button className="itinerary-button w-[100%] bg-green-100 hover:bg-green-200">
                                <ion-icon name="pencil"></ion-icon>
                                Add
                            </button>
                        </div>}
                </div>

                <div className="w-[816px] pr-4">
                    itineraries
                </div>
            </div>
        </div>
    )
}