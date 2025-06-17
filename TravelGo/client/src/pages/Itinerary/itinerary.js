import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axiosInstance from "../../utils/axiosInstance";
import ItineraryLayout from "../../components/Layout/itinerarylayout";
import Loading from "../../components/Loading/loading";

export default function Itinerary() {
    const [error, setError] = useState("");
    const [fetched, setFetched] = useState(false);
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axiosInstance
            .get(`/itineraries/${id}`)
            .then((res) => setItinerary(res.data.itinerary))
            .catch((err) => { console.error(err); setError(err.response.data.error); })
            .finally(() => { setLoading(false); setFetched(true); });
    }, [id]);

    const editItinerary = async (data) => {
        axiosInstance
            .put(`/itineraries/${id}`, data)
            .then((res) => navigate('/dashboard', { state: { message: res.data.message } }))
            .catch((err) => { console.error(err); setError(err.response.data.error); })
    };

    const deleteItinerary = async () => {
        axiosInstance
            .delete(`/itineraries/${id}`)
            .then((res) => navigate('/dashboard', { state: { message: res.data.message } }))
            .catch((err) => { console.error(err); setError(err.response.data.error); })
    };

    useEffect(() => {
        if (error) {
            setPopup(true);
            setTimeout(() => {
                setPopup(false);
                setError("");
            }, 3000);
        }
    }, [error]);

    useEffect(() => {
        if (fetched && !loading && !itinerary) return navigate('/dashboard', { state: { message: error } });
    }, [fetched, loading, itinerary, navigate, error]);

    if (loading) return <Loading />;

    return (
        <div className="start-block py-[35px]">
            {popup && <div className="error bg-[#dcf0fa] text-orange-600">{error}</div>}
            <ItineraryLayout
                mode="edit"
                itinerary={itinerary}
                editItinerary={editItinerary}
                deleteItinerary={deleteItinerary} />
        </div>
    )
}