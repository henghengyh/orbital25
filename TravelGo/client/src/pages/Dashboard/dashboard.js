import React, { useState } from "react";

import axiosInstance from "../../utils/axiosInstance";
import ItineraryCard from "../../components/Cards/intinerarycard";

export default function Dashboard() {
    const [itineray, setItinerary] = useState("");

    const getAllItinerary = async () => {
        axiosInstance.get("/itineraries/get-all-itineraries")
            .then((res) => {
                setItinerary(res.data.itineraries);
            })
            .catch((err) => {
                console.error(err.message);
            });
    }

    return (
        <div className="start-block">
            <div className="flex gap-7">
                <div className="flex-1 bg-blue-200">
                    <div className='grid grid-cols-2 gap-4'>
                        <ItineraryCard />
                        <ItineraryCard />
                        <ItineraryCard />
                    </div>
                </div>
                <div className="w-[320px] bg-green-50">calender</div>
            </div>
        </div>
    );
}