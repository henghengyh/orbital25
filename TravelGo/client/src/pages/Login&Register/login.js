import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

import backgroundImage from "../../assets/lr-bg.jpg";

export default function Login() {
    const [email, setEmail] = useState(""); // State to store the email
    const [password, setPassword] = useState(""); // State to store the password
    const [error, setError] = useState(""); // State to store any error messages
    const [popup, setPopup] = useState(false); // State to control the visibility of the popup after being redirected from a protected route
    const [message, setMessage] = useState(""); // State to store the message for the popup
    const navigate = useNavigate(); // Hook to programmatically navigate to different routes
    const location = useLocation(); // Hook to get the current location

    // Display popup for 3 seconds
    useEffect(() => {
        // Display message if the user was redirected from a protected route or after registration
        if (location.state?.fromProtectedRoute || location.state?.fromRegister) {
            setPopup(true);
            setMessage(location.state.message)
            setTimeout(() => {
                setPopup(false);
                setMessage("")
            }, 3000); // Hide the popup after 3 seconds
            window.history.replaceState({}, document.title); // Clear the state to prevent the popup from showing again on refresh
        }

        // Display error message for 3 seconds if there is an error log in
        if (error) {
            setTimeout(() => setError(""), 3000); // Clear the error message after 3 seconds
        }
    }, [location.state, error])

    // Function to handle form submission
    // It sends a POST request to the backend server with the email and password
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        axiosInstance
            .post("/users/login", { // send login request to backend server
                email: email,
                password: password,
            })
            .then((res) => {
                if (res.data) { // if login is successful, store token and user in local storage and navigate to home page
                    localStorage.setItem("token", res.data.token);
                    navigate("/dashboard");
                }
            })
            .catch((err) => {
                const message = err.response?.data?.message || "Something went wrong.";
                console.error("Registration error:", message);
                setError(message);
            });
    };

    return (
        <div className="start-div-block">
            <img src={backgroundImage} alt="Background" className="absolute inset-0 w-full h-full opacity-50 object-cover" />
            {
                popup && <div className="error bg-[#dcf0fa] text-orange-600">{message}</div>
            }
            <div className="relative z-10 w-[420px] h-[450px] bg-transparent items-center flex">
                <div className="w-full p-10">
                    <form onSubmit={handleSubmit}>
                        <h1 className="text-4xl text-center">Login</h1>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Email"
                                autoComplete="off"
                                name="email"
                                required
                                className="input-box-input"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div className="input-box-icon"><ion-icon name="mail"></ion-icon></div>
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Password"
                                autoComplete="off"
                                name="password"
                                required
                                className="input-box-input"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="input-box-icon"><ion-icon name="lock-closed"></ion-icon></div>
                        </div>
                        {
                            error && <div className="error">{error}</div> // Display error message if any
                        }
                        <button type="submit" className="w-full h-11 bg-peach border-none outline-none rounded-[40px] text-lg cursor-pointer font-semibold hover:opacity-75 hover:shadow-[rgba(0,0,0,0.2)_0_0_10px]">Log In</button>
                        <div className="text-sm mt-5 mb-4 text-center">
                            <p>
                                Don't have an account?
                                <Link to="/register" className="font-semibold pl-1 hover:underline">Register</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
