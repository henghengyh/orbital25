import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axiosInstance from "../../utils/axiosInstance";
import Loading from '../Loading/loading';

export default function PrivateRoutes() {
    const [valid, setValid] = useState(null);
    const token = localStorage.getItem("token"); // Get the token from local storage

    useEffect(() => {
        const authenticateToken = async () => {
            axiosInstance.get("/protected")
                .then(res => {
                    console.log(res.data);
                    if (res.data) {
                        setValid(true); // If the response is successful, set valid to true
                    }
                }).catch((err) => {
                    console.error("Token validation failed:", err);
                    setValid(false); // If there's an error, set valid to false
                });
        }

        if (token) {
            authenticateToken(); // Call the function to validate the token
        } else {
            setValid(false); // If no token, set valid to false
        }
    }, [token]);

    if (valid === null) {
        return (<Loading />);
    }

    // If valid token exists, render the child routes; otherwise, redirect to the home page
    return (valid
        ? <Outlet />
        : <Navigate to="/" replace state={{
            fromProtectedRoute: true,
            message: "Please log in to continue."
        }} />
    );
}