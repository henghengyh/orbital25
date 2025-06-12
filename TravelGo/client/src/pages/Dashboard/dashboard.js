import React, { useEffect, useState } from "react";
import { DayPicker } from 'react-day-picker';
import moment from 'moment/moment';

import { useItinerary } from "../../context/ItineraryContext/itinerarycontext";
import axiosInstance from "../../utils/axiosInstance";
import ItineraryCard from "../../components/Cards/intinerarycard";
import EmptyCard from "../../components/Cards/emptycard";

export default function Dashboard() {
    const [dateRange, setDateRange] = useState({ from: null, to: null });

    const { allItineraries, setAllItineraries, searched, setSearched, searchResults, setSearchResults } = useItinerary();

    const getAllItinerary = async () => {
        axiosInstance
            .get("/itineraries/get-all-itineraries")
            .then((res) => { setAllItineraries(res.data.itineraries); })
            .catch((err) => { console.error(err.message); });
    }

    useEffect(() => {
        getAllItinerary();
        return () => { };
    });

    const itineraries = searched ? searchResults : allItineraries;

    const handleClick = () => { }

    const filterItineraryByDate = async (day) => {
        if (!day || !day.from || !day.to) {
            setSearchResults([]);
            setSearched(false);
            return;
        }

        const start = moment(day.from).valueOf();
        const end = moment(day.to).valueOf();

        axiosInstance
            .get('/itineraries/filter', { params: { start, end } })
            .then((res) => { setSearchResults(res.data.itineraries); setSearched(true) })
            .catch((err) => console.error(err.message));
    }

    const handleDayClick = (day) => {
        setDateRange(day);
        filterItineraryByDate(day);
    }

    return (
        <div className="start-block">
            <div className="flex gap-7">
                <div className="flex-1 h-[490px] overflow-y-scroll scrollbar">
                    {itineraries.length > 0
                        ? (
                            <div className="grid grid-cols-2 gap-4">
                                {itineraries.map((item) => {
                                    return (
                                        <ItineraryCard
                                            key={item._id}
                                            destination={item.destination}
                                            imageUrl={item.imageUrl}
                                            startDate={item.startDate}
                                            endDate={item.endDate}
                                            numberOfPeople={item.numberOfPeople}
                                            notes={item.notes}
                                            onClick={() => handleClick(item)}
                                        />
                                    );
                                })}
                            </div>
                        ) : (<EmptyCard />)}
                </div>

                <div className="w-[335px]">
                    <div className="bg-off-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
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

                <div className="absolute bottom-10 right-0 bg-blue-200 grid place-items-center h-14 w-14 rounded-full cursor-pointer hover:shadow-md z-10">
                    <ion-icon name="add" style={{ height: "30px", width: "30px" }}></ion-icon>
                </div>
            </div>
        </div>
    );
}