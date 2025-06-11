import React, { useEffect, useState } from "react";
import { DayPicker } from 'react-day-picker';

import axiosInstance from "../../utils/axiosInstance";
import ItineraryCard from "../../components/Cards/intinerarycard";

export default function Dashboard() {
    const [dateRange, setDateRange] = useState({ form: null, to: null });
    const [itineray, setItinerary] = useState("");

    const getAllItinerary = async () => {
        axiosInstance
            .get("/itineraries/get-all-itineraries")
            .then((res) => {
                setItinerary(res.data.itineraries);
            })
            .catch((err) => {
                console.error(err.message);
            });
    }

    const handleClick = () => { }

    const filterItineraryByDate = async (day) => {

    }

    const handleDayClick = (day) => {
        setDateRange(day);
        filterItineraryByDate(day);
    }

    useEffect(() => {
        getAllItinerary();
        return () => { };
    }, []);

    return (
        <div className="start-block">
            <div className="flex gap-7">
                <div className="flex-1 bg-blue-200">
                    {itineray.length > 0
                        ? (
                            <div className="grid grid-cols-2 gap-4">
                                {itineray.map((item) => {
                                    return (
                                        <ItineraryCard
                                            key={item._id}
                                            destination={item.destination}
                                            startDate={item.startDate}
                                            endDate={item.endDate}
                                            numberOfPeople={item.numberOfPeople}
                                            notes={item.notes}
                                            onClick={() => handleClick(item)}
                                        />
                                    );
                                })}
                            </div>
                        ) : (<>Empty Itinerary</>)}
                </div>

                <div className="w-[335px]">
                    <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
                        <div className="p-3">
                            <DayPicker
                                navLayout="around"
                                captionLayout="dropdown-buttons"
                                mode="range"
                                selected={dateRange}
                                onSelect={handleDayClick}
                                pagedNavigation
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}