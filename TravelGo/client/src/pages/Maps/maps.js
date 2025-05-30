import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

import Navbar from '../../components/Navbar/navbar';

export default function Maps() {
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
                <h1>Explore the world with our interactive maps</h1>
                <p>Find your way, discover new places, and plan your next adventure.</p>
                <p>Use our map features to navigate through cities and attractions.</p>
            </div>
        </div>
    )
}