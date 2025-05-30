import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import Navbar from '../../components/Navbar/navbar';
import axiosInstance from '../../utils/axiosInstance';

export default function Dashboard() {
    const [user, setUser] = useState(null); // State to store user information
    const navigate = useNavigate();

    const getUserInfo = async () => {
        axiosInstance.get("/users/getUserInfo")
            .then((res) => {
                if (res.data && res.data.user) {
                    setUser(res.data.user); // Set user information from the response
                }
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    console.error("Unauthorized access, redirecting to login.");
                }
                navigate("/");
            })
    }

    useEffect(() => {
        getUserInfo();
        return () => { }
    });

    return (
        <div className="start-div-block">
            <Navbar user={user} /> {/* Navbar component for navigation */}
            <div className='flex-1 p-8'>
                <h1>Welcome to TravelGo</h1>
                <p>Your one-stop solution for all travel needs.</p>
                <p>Explore destinations, book flights, and find accommodations.</p>
                <p>Start your journey with us today!</p>
            </div>
        </div>
    );
}