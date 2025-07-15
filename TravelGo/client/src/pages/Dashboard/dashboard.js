import { useCallback, useEffect, useState } from "react";
import { DayPicker } from 'react-day-picker';
import { useLocation, useNavigate } from "react-router-dom";

import { useItinerary } from "../../context/ItineraryContext/itinerarycontext";
import axiosInstance from "../../utils/axiosInstance";
import EmptyCard from "../../components/Cards/emptycard";
import ItineraryCard from "../../components/Cards/itinerarycard";
import SearchLoading from "../../components/Loading/searchloading";

export default function Dashboard() {
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [error, setError] = useState("");
    const [popup, setPopup] = useState(false);

    const {
        allItineraries, setAllItineraries,
        loading, setLoading,
        searched, setSearched,
        searchResults, setSearchResults
    } = useItinerary();
    const location = useLocation();
    const navigate = useNavigate();

    const getAllItinerary = useCallback((controller) => {
        axiosInstance
            .get("/itineraries/get-all-itineraries", { signal: controller.signal })
            .then((res) => { setAllItineraries(res.data.itineraries); setLoading(false); })
            .catch((err) => { if (err.name !== "CanceledError") console.error(err.message); });
    }, [setAllItineraries, setLoading]);

    useEffect(() => {
        setLoading(true);
        const controller = new AbortController();
        getAllItinerary(controller);
        return () => controller.abort();
    }, [getAllItinerary, setLoading]);

    useEffect(() => {
        return () => {
            setSearched(false);
            setSearchResults([]);
            setDateRange({ from: null, to: null });
            setLoading(false);
        };
    }, [setDateRange, setLoading, setSearched, setSearchResults]);

    const itineraries = searched ? searchResults : allItineraries;

    useEffect(() => {
        if (location.state?.message) {
            setError(location.state.message);
            setPopup(true);
            setTimeout(() => {
                setPopup(false);
                setError("");
            }, 3000);
            window.history.replaceState({}, document.title);
        }
    }, [location.state])

    const filterItineraryByDate = async (day) => {
        if (!day || !day.from || !day.to || day.from.getTime() === day.to.getTime()) {
            setSearchResults([]);
            setSearched(false);
            return;
        };

        const toUTCDate = (day) => {
            const date = new Date(day);
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
        };

        setLoading(true);
        const start = toUTCDate(day.from);
        const end = toUTCDate(day.to);
        axiosInstance
            .get('/itineraries/filter', { params: { start, end } })
            .then((res) => { setSearchResults(res.data.itineraries); setSearched(true) })
            .catch((err) => console.error(err.message))
            .finally(() => setLoading(false));
    }

    const handleDayClick = (day) => {
        if (!day) {
            setDateRange({ from: null, to: null });
            setSearchResults([]);
            setSearched(false);
            return;
        };

        const singleDay = day?.from && day?.to && day.from.getTime() === day.to.getTime();
        let newDay = singleDay ? { from: day?.from, to: null } : day;
        setDateRange(newDay);
        filterItineraryByDate(newDay);
    }

    return (
        <div className="start-block">
            <div className="flex gap-7">
                {popup && <div className="error bg-[#dcf0fa] text-orange-600">{error}</div>}
                <div className="flex-1 overflow-y-auto scrollbar">
                    {loading ? <SearchLoading />
                        : itineraries.length > 0
                            ? (<div className="grid grid-cols-2 gap-6">
                                {itineraries.map((item) => {
                                    return (
                                        <ItineraryCard
                                            key={item._id}
                                            tripName={item.tripName}
                                            destination={item.destination}
                                            imageNumber={item.imageNumber}
                                            startDate={item.startDate}
                                            endDate={item.endDate}
                                            numberOfPeople={item.numberOfPeople}
                                            onClick={() => navigate(`/itinerary/${item._id}`)}
                                        />
                                    );
                                })}
                            </div>)
                            : (<EmptyCard />)}
                </div>

                <div className="w-[335px]">
                    <div role="listbox" aria-label="calender" className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
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

                    <div className="mt-24 items-end justify-end flex">
                        <button aria-label="create itinerary" onClick={() => navigate('/create-itinerary')} className="bg-blue-200 grid place-items-center h-14 w-14 rounded-full cursor-pointer hover:shadow-md z-10">
                            <ion-icon name="add" style={{ height: "30px", width: "30px" }}></ion-icon>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}