import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Itinerary() {
    const [destination, setDestination] = useState("");
    const [end, setEnd] = useState(null);
    const [notes, setNotes] = useState("");
    const [people, setPeople] = useState(1);
    const [start, setStart] = useState(null);

    const navigate = useNavigate();

    return (
        <div className="start-block py-[35px]">
            <div className="flex flex-col h-[500px] bg-white shadow-xl rounded-xl border-2">
                <div className="flex items-center justify-between pl-6 pr-4 py-3">
                    <h5 className="text-xl font-semibold">Add Itinerary</h5>
                    <div onClick={() => navigate('/dashboard')} className="cursor-pointer">
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
                                <h6 className="text-label">Destination:</h6>
                                <input
                                    type="text"
                                    placeholder="destination"
                                    name="destination"
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
                                    className="text-sm bg-off-white px-3 py-2 rounded w-16"
                                    onChange={(e) => setPeople(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2 pt-2">
                                <h6 className="text-label">Notes:</h6>
                                <textarea
                                    type="text"
                                    placeholder="notes"
                                    name="notes"
                                    rows={3}
                                    className="text-input overflow-y-scroll scrollbar"
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 absolute bottom-[58px] w-[304px] h-9">
                            <button className="itinerary-button bg-green-100">
                                <ion-icon name="pencil"></ion-icon>
                                Add
                            </button>
                            <button className="itinerary-button bg-red-100">
                                <ion-icon name="trash"></ion-icon>
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="w-[816px] pr-4">
                        itineraries
                    </div>
                </div>
            </div>
        </div>
    )
}