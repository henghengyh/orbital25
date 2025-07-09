import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../utils/axiosInstance";
import ItineraryLayout from "../../components/Layout/itinerarylayout";

export default function CreateItinerary() {
    const [error, setError] = useState("");
    const [popup, setPopup] = useState(false);

    const navigate = useNavigate();

    const addItinerary = async (data) => {
        axiosInstance
            .post('/itineraries', data)
            .then((res) => navigate('/dashboard', { state: { message: res.data.message } }))
            .catch((err) => { console.error(err); setError(err.response.data.error); });
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

    return (
        <div className="start-block py-8">
            {popup && <div className="error">{error}</div>}
            <ItineraryLayout mode="create" addItinerary={addItinerary} />
        </div>
    )
}