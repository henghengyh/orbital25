import { useCallback, useEffect, useState } from "react"

import axiosInstance from "../../utils/axiosInstance";

export default function ItineraryModal({ chosen, onClose, changeItinerary }) {
    const [allItinerary, setAllItinerary] = useState([]);
    const [error, setError] = useState("");
    const [popup, setPopup] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState("");

    const getAllItinerary = useCallback((controller) => {
        axiosInstance
            .get("/itineraries/get-all-itineraries", { signal: controller.signal })
            .then((res) => setAllItinerary(res.data.itineraries))
            .catch((err) => {
                if (err.name === "CanceledError") {
                    console.log("Get-all-itinerary request canceled");
                } else {
                    console.error(err.message);
                }
            });
    }, [setAllItinerary]);

    useEffect(() => {
        const controller = new AbortController();
        getAllItinerary(controller);
        return () => controller.abort();
    }, [getAllItinerary]);

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
                <h5 className="text-xl font-semibold">Change Itinerary</h5>
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
            <div className="flex flex-col justify-center items-center gap-4 mt-4">
                <label className="text-xl font-semibold text-blue-700 text-center">
                    Select Your Trip
                </label>
                <div className="flex justify-center">
                    <select
                        value={selectedTrip}
                        onChange={(e) => setSelectedTrip(e.target.value)}
                        className="w-fit h-12 px-4 py-2 border border-blue-300 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-200 ease-in-out cursor-pointer hover:border-blue-400"
                    >
                        <option disabled value="">Select one:</option>
                        {allItinerary
                            .filter(t => t._id !== chosen)
                            .map(t => (
                                <option key={t._id} value={t._id}>
                                    {t.tripName} ({t.startDate.slice(0, 10)} - {t.endDate.slice(0, 10)})
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-center mt-7 w-full h-10">
                <div onClick={(e) => {
                    e.preventDefault();
                    changeItinerary(selectedTrip);
                }}
                    className="itinerary-button h-10 bg-green-200 hover:bg-green-300">
                    Change
                </div>
            </div>
        </div>
    )
}