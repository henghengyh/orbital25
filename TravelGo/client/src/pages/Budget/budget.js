import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import analyticsImage from '../../assets/analytics.png';
import axiosInstance from "../../utils/axiosInstance";
import calculatorImage from '../../assets/calculator.png';
import Loading from '../../components/Loading/loading';

export default function Budget() {
    const [allItineraries, setAllItineraries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState("");

    const navigate = useNavigate();

    const getAllItinerary = useCallback((controller) => {
        axiosInstance
            .get("/itineraries/get-all-itineraries", { signal: controller.signal })
            .then((res) => { setAllItineraries(res.data.itineraries); setLoading(false); })
            .catch((err) => {
                if (err.name === "CanceledError") {
                    console.log("Get-all-itinerary request canceled");
                } else {
                    console.error(err.message);
                }
            });
    }, [setAllItineraries, setLoading]);

    useEffect(() => {
        setLoading(true);
        const controller = new AbortController();
        getAllItinerary(controller);
        return () => controller.abort();
    }, [getAllItinerary, setLoading]);

    if (loading) return <Loading />

    return (
        <div className="relative mx-auto">
            <img src={analyticsImage} alt="Analytics" className="w-64 h-64 absolute top-5 left-32 z-0 object-contain" />

            <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md relative z-10 top-20 bg-opacity-95">
                <h3 className="text-3xl font-bold text-blue-700 mb-6 text-center">
                    Select Your Trip
                </h3>
                <p className="text-gray-600 text-center mb-4">
                    Start by choosing a trip to begin logging your expenses.
                </p>
                <div className="flex justify-center">
                    <select
                        value={selectedTrip}
                        onChange={(e) => setSelectedTrip(e.target.value)}
                        className="w-fit h-12 px-4 py-2 border border-blue-300 rounded-lg shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-200 ease-in-out cursor-pointer hover:border-blue-400"
                    >
                        <option disabled value="">Select one:</option>
                        {allItineraries.map(t => (
                            <option key={t._id} value={t._id}>
                                {t.tripName} ({t.startDate.slice(0, 10)} - {t.endDate.slice(0, 10)})
                            </option>
                        ))}
                    </select>
                </div>

                <div onClick={() => navigate(`/budget/${selectedTrip}`)} className="flex items-center gap-3 text-blue-600 text-xl font-medium mt-5 p-2 px-4 w-fit mx-auto rounded-lg justify-center cursor-pointer hover:bg-blue-100 hover:text-red-500">
                    <ion-icon name="card" style={{ fontSize: "30px"}}></ion-icon>
                    <span>Start Budgeting</span>
                </div>

            </div>

            <img src={calculatorImage} alt="calculator" className="w-64 h-64 absolute top-52 right-32 z-0 object-contain" />
        </div>
    )
}