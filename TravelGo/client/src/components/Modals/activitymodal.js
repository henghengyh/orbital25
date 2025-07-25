import React, { useEffect, useState } from "react";
import TransportModal from "../Modals/TransportModal";
import TransportWarning from "../Modals/Transport/TransportWarning";
import LocationRow from './LocationRow';
import axiosInstance from '../../utils/axiosInstance';

export default function ActivityModal({
    mode, activity, date, onClose, addActivity, editActivitiy, deleteActivity }) {
    const [activityName, setActivityName] = useState(activity?.activityName || "");
    const [endLocation, setEndLocation] = useState(activity?.transport?.endLoc || "");
    const [endTime, setEndTime] = useState(activity?.endTime || "");
    const [error, setError] = useState("");
    const [location, setLocation] = useState(activity?.location || null);
    const [locationSearchQuery, setLocationSearchQuery] = useState('');
    const [locationSearchResults, setLocationSearchResults] = useState([]);
    const [modeOfTransport, setModeOfTransport] = useState(activity?.transport?.modeOfTransport || "");
    const [notes, setNotes] = useState(activity?.notes || "");
    const [popup, setPopup] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [startLocation, setStartLocation] = useState(activity?.transport?.startLoc || "");
    const [startTime, setStartTime] = useState(activity?.startTime || "");
    const [type, setType] = useState(activity?.type || "-");

    const edit = mode === "edit";
    const typeOfActivities = ["Meal", "Shopping", "Sightseeing", "Transport", "Other"];

    const validInputCheck = (fn) => {
        if (!activityName) { setError("Invalid Activity Name"); return; }
        if (!startTime || (endTime && startTime >= endTime)) { setError("Invalid Start Time"); return; }
        if (!endTime || endTime <= startTime) { setError("Invalid End Time"); return; }
        if (!type || type === "-") { setError("Invalid Activity Type"); return; }
        fn();
    };

    const searchLocations = async function (query, setResults, setShowDropdown, name) {
        if (query.length < 2) {
            setResults([]);
            return;
        }
        try {
            const response = await axiosInstance.get(`/maps/search-locations?query=${query}`);
            const resultsList = response.data.places || [];
            setResults(resultsList);
            setShowDropdown(true);
        } catch (error) {
            console.error(`Error searching ${name}:`, error);
            setResults([]);
        }
    };

    const handleLocationSelect = (location) => {
        setLocation(location);
        setLocationSearchQuery(location.description);
        setShowLocationDropdown(false);
        setLocationSearchResults([]);
    };

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

    useEffect(() => {
        if (location) {
            setLocationSearchQuery(location.description || '');
        }
    }, [location]);

    return (
        <div className="flex flex-col w-full h-full scrollbar overflow-auto">
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
                        name="activityName"
                        value={activityName}
                        autoComplete="off"
                        required
                        className="text-input"
                        onChange={(e) => setActivityName(e.target.value)}
                    />
                </div>
                <div className="pt-2 flex gap-5">
                    <div className="flex flex-col gap-3 w-[33%]">
                        <h6 className="text-label">Date:</h6>
                        <input
                            type="text"
                            value={date}
                            disabled
                            className="text-input w-full"
                        />
                    </div>
                    <div className="flex flex-col gap-3 w-[33%]">
                        <label htmlFor="startTime" className="text-label">Start Time:</label>
                        <div className="flex">
                            <input
                                id="startTime"
                                type="time"
                                name="startTime"
                                max={endTime ? endTime : undefined}
                                value={startTime}
                                required
                                className="text-input w-full cursor-text"
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 w-[33%]">
                        <label htmlFor="endTime" className="text-label">End Time:</label>
                        <div className="flex">
                            <input
                                id="endTime"
                                type="time"
                                name="endTime"
                                min={startTime ? startTime : undefined}
                                value={endTime}
                                required
                                className="text-input w-full cursor-text"
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <TransportWarning 
                    activity={activity}
                />

                <div className="flex gap-5 pt-4">
                    <h6 className="text-label">Type:</h6>
                    <select
                        aria-label="type"
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

                {type === "Transport" ? 
                    <TransportModal
                        modeOfTransport={modeOfTransport}
                        setModeOfTransport={setModeOfTransport}
                        startLocation={startLocation}
                        setStartLocation={setStartLocation}
                        endLocation={endLocation}
                        setEndLocation={setEndLocation}
                    /> : 
                    <LocationRow
                        label="Location"
                        searchQuery={locationSearchQuery}
                        setSearchQuery={setLocationSearchQuery}
                        searchResults={locationSearchResults}
                        showDropdown={showLocationDropdown}
                        setShowDropdown={setShowLocationDropdown}
                        onLocationSelect={handleLocationSelect}
                        searchLocations={(query) => searchLocations(query, setLocationSearchResults, setShowLocationDropdown, "end location")}
                    />
                }

                <div className="flex flex-col gap-3 pt-2">
                    <h6 className="text-label">Notes:</h6>
                    <textarea
                        data-testid="activity notes"
                        type="text"
                        placeholder="notes"
                        name="notes"
                        rows={4}
                        autoComplete="off"
                        value={notes}
                        className="text-input overflow-y-auto scrollbar"
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                {edit
                    ? <div className="flex gap-2 mt-7 mb-6 w-full h-10">
                        <button onClick={(e) => {
                            e.preventDefault();
                            validInputCheck(() => editActivitiy(activity._id, { activityName, date: new Date(date), startTime, endTime, type, location, notes, transport:{
                                modeOfTransport,
                                startLoc: startLocation,
                                endLoc: endLocation
                            } }));
                        }}
                            className="itinerary-button bg-green-200 hover:bg-green-300">
                            <ion-icon name="pencil"></ion-icon>
                            Save
                        </button>
                        <button onClick={(e) => { e.preventDefault(); deleteActivity(activity._id) }}
                            className="itinerary-button bg-red-200 hover:bg-red-300">
                            <ion-icon name="trash"></ion-icon>
                            Delete
                        </button>
                    </div>
                    : <button
                        data-testid="activity add button"
                        onClick={(e) => {
                            e.preventDefault();
                            validInputCheck(() => addActivity({ activityName, date: new Date(date), startTime, endTime, type, location, notes, transport:{
                                modeOfTransport,
                                startLoc: startLocation,
                                endLoc: endLocation
                            } }));
                        }}
                        className="flex gap-2 mt-7 mb-6 w-full h-10 itinerary-button bg-green-200 hover:bg-green-300">
                        <ion-icon name="pencil"></ion-icon>
                        Add
                    </button>}
            </div>
        </div >
    )
}