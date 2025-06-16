import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axiosInstance from "../../utils/axiosInstance";
import ItineraryLayout from "../../components/Layout/itinerarylayout";
import Loading from "../../components/Loading/loading";

export default function Itinerary() {
    const [itinerary, setItinerary] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        axiosInstance
            .get(`/itineraries/${id}`)
            .then((res) => setItinerary(res.data.itinerary))
            .catch((err) => console.error(err))
    }, [id]);

    if (!itinerary) return <Loading />

    return (
        <div className="start-block py-[35px]">
            <ItineraryLayout mode="edit" itinerary={itinerary} />
        </div>
    )
}