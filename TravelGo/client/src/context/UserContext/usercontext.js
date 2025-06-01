import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../utils/axiosInstance";

const UserContext = createContext();

export default function UserProvider({ children }) {
    const [user, setUser] = useState(null); // Store user information

    const navigate = useNavigate();

    useEffect(() => {
        if (user) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        axiosInstance.get("/users/getUserInfo")
            .then((res) => {
                if (res.data && res.data.user) {
                    setUser(res.data.user); // Set user information from the response
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    console.error("Unauthorized access, redirecting to login.");
                }
                navigate("/");
            })
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext);
}