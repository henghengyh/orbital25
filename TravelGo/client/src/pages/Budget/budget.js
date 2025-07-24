import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import analyticsImage from '../../assets/analytics.png';
import axiosInstance from "../../utils/axiosInstance";
import calculatorImage from '../../assets/calculator.png';
import Loading from '../../components/Loading/loading';

export default function Budget() {
    const [allItineraries, setAllItineraries] = useState([]);
    const [budget, setBudget] = useState(1);
    const [budgetPresent, setBudgetPresent] = useState(false);
    const [display, setDisplay] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState("");

    const navigate = useNavigate();

    const getAllItinerary = useCallback((controller) => {
        axiosInstance
            .get("/itineraries/get-all-itineraries", { signal: controller.signal })
            .then(res => { setAllItineraries(res.data.itineraries); setLoading(false); })
            .catch(err => {
                if (err.name !== "CanceledError") {
                    console.error("Error getting all itineraries:", err.response?.data?.message || "Something went wrong");
                }
            });
    }, [setAllItineraries, setLoading]);

    useEffect(() => {
        setLoading(true);
        const controller = new AbortController();
        getAllItinerary(controller);
        return () => controller.abort();
    }, [getAllItinerary, setLoading]);

    const checkBudget = (selectedTrip) => {
        axiosInstance
            .get(`/budget/${selectedTrip}`)
            .then(res => {
                if (res.data?.budget?.[0]?.budget) setBudgetPresent(true);
                setDisplay(true);
            })
            .catch(err => console.error("Error getting budget for this itinerary:", err.response?.data?.message || "Something went wrong"));
    }

    useEffect(() => {
        if (selectedTrip !== "") { setDisplay(false); setBudgetPresent(false); checkBudget(selectedTrip); }
    }, [selectedTrip]);

    const startBudget = () => {
        if (budget <= 0) {
            setError("Invalid budget");
        } else {
            axiosInstance
                .post('/budget', {
                    itineraryIdString: selectedTrip,
                    budget,
                    itineraryTitle: allItineraries.find(t => t._id === selectedTrip).tripName
                })
                .then(res => navigate(`/budget/${selectedTrip}`))
                .catch(err => console.error("Error adding budget:", err.response?.data?.message || "Something went wrong"));
        }
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

    if (loading) return <Loading />

    return (
        <div className="relative mx-auto">
            {popup && <div className="error">{error}</div>}
            <img src={analyticsImage} alt="Analytics" className="w-64 h-64 absolute top-5 left-32 z-0 object-contain" />

            <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md relative z-10 top-16 bg-opacity-95">
                <h3 className="text-3xl font-bold text-blue-700 mb-6 text-center">
                    Select Your Trip
                </h3>
                <p className="text-gray-600 text-center mb-4 font-semibold">
                    Start by choosing a trip and budget to begin logging your expenses.
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
                                {t.tripName?.length > 20 ? `${t.tripName?.slice(0, 20)}...` : t.tripName} ({t.startDate.slice(0, 10)} - {t.endDate.slice(0, 10)})
                            </option>
                        ))}
                    </select>
                </div>

                {display && (
                    !budgetPresent
                        ? (<>
                            <div className="flex justify-center items-center gap-4 mt-4">
                                <label className="text-gray-700 text-center w-32 font-semibold">
                                    Total Budget:
                                </label>
                                <input
                                    type="number"
                                    placeholder="2000"
                                    min={1}
                                    value={budget}
                                    autoFocus
                                    onChange={(e) => setBudget(Number(e.target.value))}
                                    className="max-w-xs px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <button onClick={startBudget} className="flex items-center gap-3 text-blue-600 text-xl font-medium mt-5 p-2 px-4 w-fit mx-auto rounded-lg justify-center cursor-pointer hover:bg-blue-100 hover:text-red-500">
                                <ion-icon name="card" style={{ fontSize: "30px" }}></ion-icon>
                                <span>Start Budgeting</span>
                            </button>
                        </>)
                        : (<button onClick={() => navigate(`/budget/${selectedTrip}`)} className="flex items-center gap-3 text-blue-600 text-xl font-medium mt-5 p-2 px-4 w-fit mx-auto rounded-lg justify-center cursor-pointer hover:bg-blue-100 hover:text-red-500">
                            <ion-icon name="card" style={{ fontSize: "30px" }}></ion-icon>
                            <span>Continue Budgeting</span>
                        </button>)
                )}
            </div>

            <img src={calculatorImage} alt="calculator" className="w-64 h-64 absolute top-52 right-32 z-0 object-contain" />
        </div>
    )
}