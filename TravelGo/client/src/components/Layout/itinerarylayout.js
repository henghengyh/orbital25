import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ActivityLayout from "./activitylayout";
import axiosInstance from "../../utils/axiosInstance";
import EmptyActivity from "../Cards/emptyactivity";
import InviteCollaboratorModal from "../Modals/InviteCollaboratorModal";
import ConfirmDeleteLeaveModal from "../Modals/ConfirmDeleteLeaveModal";

export default function ItineraryLayout({ mode, itinerary, addItinerary, editItinerary, deleteItinerary, leaveItinerary }) {
    const [activities, setActivities] = useState(itinerary?.activities || []);
    const [dates, setDates] = useState([]);
    const [destination, setDestination] = useState(itinerary?.destination || "");
    const [endDate, setEndDate] = useState(itinerary?.endDate || null);
    const [error, setError] = useState("");
    const [notes, setNotes] = useState(itinerary?.notes || "");
    const [numberOfPeople, setNumberOfPeople] = useState(itinerary?.numberOfPeople || 1);
    const [popup, setPopup] = useState(false);
    const [startDate, setStartDate] = useState(itinerary?.startDate || null);
    const [tripName, setTripName] = useState(itinerary?.tripName || "");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(""); // "Delete" or "Leave"

    const { id } = useParams();
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

    const updateActivities = () => {
        axiosInstance
            .get(`/itineraries/${id}/activities`)
            .then((res) => setActivities(res.data))
            .catch((err) => console.error(err));
    }

    const validInputCheck = (fn) => {
        if (!tripName) { setError("Invalid Trip Name"); return; }
        if (!destination) { setError("Invalid Destination"); return; }
        if (!startDate) { setError("Invalid Start Date"); return; }
        if (!endDate || formatDate(endDate) < formatDate(startDate)) { setError("Invalid End Date"); return; }
        fn();
    }

    useEffect(() => {
        if (error) {
            setPopup(true);
            setTimeout(() => {
                setPopup(false);
                setError("");
            }, 3000);
            window.history.replaceState({}, document.title);
        }
    }, [error])


    useEffect(() => {
        async function fetchOwnerStatus() {
            const resOwner = await axiosInstance.get(`/itineraries/${id}/isOwner`);
            setIsOwner(resOwner.data.isOwner);
        }
        if (itinerary?._id) fetchOwnerStatus();
    }, [itinerary, id]);

    const handleDeleteLeaveClick = () => {
        setConfirmAction(isOwner ? "Delete" : "Leave");
        setShowConfirmModal(true);
    };

    const handleConfirmAction = () => {
        setShowConfirmModal(false);
        if (confirmAction === "Delete") {
            deleteItinerary();
        } else {
            leaveItinerary();
        }
    };


    return (
        <div className="flex flex-col bg-white shadow-xl rounded-xl border-2">
            {popup && <div className="error">{error}</div>}
            {showInviteModal && (
                <InviteCollaboratorModal
                    onClose={() => setShowInviteModal(false)}
                    onInvite={async (email, message) => {
                        const res = await axiosInstance.post(`/itineraries/${id}/invite-collaborator`, {invitedEmail: email, message});
                        return res;

                    }}
                    itinerary={itinerary}
                />
            )}
            <ConfirmDeleteLeaveModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onAction={handleConfirmAction}
                itinerary={itinerary}
                actionString={confirmAction}
            />
            <div className="flex items-center justify-between pl-6 pr-4 py-3">
                <h5 className="text-xl font-semibold">{edit ? "Edit Itinerary" : "Add Itinerary"}</h5>
                <div className="flex items-center gap-8">
                    <button
                        className="itinerary-button w-[200px] py-2 bg-blue-200 hover:bg-blue-300"
                        
                        onClick={() => setShowInviteModal(true)}
                    >
                        <ion-icon name="person-add-outline"></ion-icon>
                        Invite Collaborators
                    </button>
                    <div onClick={() => navigate('/dashboard')} className="cursor-pointer rounded-full hover:bg-slate-200">
                        <ion-icon
                            name="close"
                            style={{ alignItems: "center", display: "flex", height: "20px", width: "20px" }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-7 pb-4">
                <div className="w-27vw pl-4">
                    <div className="pb-14">
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
                                        max={endDate ? formatDate(endDate) : undefined}
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
                                        min={startDate ? formatDate(startDate) : undefined}
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
                                className="text-input overflow-y-auto scrollbar"
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    
                        <div>
                        {edit
                            ? <div className="flex gap-2 absolute bottom-[54px] w-[304px] h-9">
                                <div onClick={(e) => {
                                    e.preventDefault();
                                    validInputCheck(() => editItinerary({ tripName, destination, startDate, endDate, numberOfPeople, notes }));
                                }}
                                    className="itinerary-button bg-green-200 hover:bg-green-300">
                                    <ion-icon name="pencil"></ion-icon>
                                    Save
                                </div>
                                <div onClick={(e) => { 
                                    e.preventDefault(); 
                                    handleDeleteLeaveClick();
                                }}
                                    className="itinerary-button bg-red-200 hover:bg-red-300">
                                    <ion-icon name="trash"></ion-icon>
                                    {isOwner ? "Delete" : "Leave"}
                                </div>
                            </div>
                            : <div
                                onClick={(e) => {
                                    e.preventDefault();
                                    validInputCheck(() => addItinerary({ tripName, destination, startDate, endDate, numberOfPeople, activities, notes }));
                                }}
                                className="flex gap-2 absolute bottom-[54px] w-[304px] h-9 itinerary-button bg-green-200 hover:bg-green-300">
                                <ion-icon name="pencil"></ion-icon>
                                Add
                            </div>
                        }
                        </div>
                    </div>
                </div>

                <div className="w-71vw pr-4 overflow-x-auto scrollbar">
                    <div className="flex flex-row gap-2 px-1 overflow-x-auto scrollbar border-slate-300 rounded bg-gray-300 flex h-[428px]">
                        {dates.length > 0
                            ? dates.map((date, idx) => (
                                <ActivityLayout
                                    key={idx}
                                    date={date}
                                    activities={activities}
                                    setActivities={setActivities}
                                    updateActivities={updateActivities}
                                />
                            ))
                            : <EmptyActivity dateSelected={false} />}
                    </div>
                </div>
            </div>
        </div>
    )
}