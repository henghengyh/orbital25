import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./login&register.css";
import backgroundImage from "../../assets/lr-bg.jpg";

export default function Login() {
    const [email, setEmail] = useState(""); // State to store the email
    const [password, setPassword] = useState(""); // State to store the password
    const [error, setError] = useState(""); // State to store any error messages
    const navigate = useNavigate(); // Hook to programmatically navigate to different routes

    // Function to handle form submission
    // It sends a POST request to the backend server with the email and password
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        axios
            .post("http://localhost:5001/api/users/login", { // send login request to backend server
                email: email,
                password: password,
            })
            .then((res) => {
                console.log(res.data);
                if (res.data) { // if login is successful, store token in local storage and navigate to home page
                    localStorage.setItem("token", res.data.token);
                    navigate("/home");
                }
            })
            .catch((err) => {
                console.error(
                    "Registration error:",
                    err.response?.data?.message || "Something went wrong."
                );
                setError("Invalid Email or Password");
            });
    };

    return (
        <div className="bg">
            <img src={backgroundImage} alt="Background" className="background-image" />
            <div className="lr">
                <div className="lr-container">
                    <form onSubmit={handleSubmit}>
                        <h1>Login</h1>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Email"
                                autoComplete="off"
                                name="email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div><ion-icon name="mail"></ion-icon></div>
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Password"
                                autoComplete="off"
                                name="password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div><ion-icon name="lock-closed"></ion-icon></div>
                        </div>
                        {
                            error && <p className="lr-error">{error}</p> // Display error message if any
                        }
                        <button type="submit">Log In</button>
                        <div className="lr-link">
                            <p>
                                Don't have an account?
                                <Link to="/register">Register</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
