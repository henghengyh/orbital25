import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./login&register.css";
import backgroundImage from "../../assets/lr-bg.jpg";

export default function Register() {
    const [user, setUser] = useState(""); // State to store the username
    const [email, setEmail] = useState(""); // State to store the email
    const [password, setPassword] = useState(""); // State to store the password
    const [error, setError] = useState(""); // State to store any error messages
    const navigate = useNavigate(); // Hook to programmatically navigate to different routes

    // Function to handle form submission
    // It sends a POST request to the backend server with the username, email and password
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        axios
            .post("http://localhost:5001/api/users/register", { // send registration request to backend server
                name: user,
                email: email,
                password: password,
            })
            .then((res) => {
                console.log(res.data);
                if (res.data) { // If registration is successful, navigate to the login page
                    navigate("/");
                }
            })
            .catch((err) => {
                const message = err.response?.data?.message || "Something went wrong. Please try again.";
                console.error("Registration error:", message);
                setError(message);
            });
    };

    return (
        <div className="bg">
            <img src={backgroundImage} alt="Background" className="background-image" />
            <div className="lr">
                <div className="lr-container">
                    <form onSubmit={handleSubmit}>
                        <h1>Register</h1>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Username"
                                autoComplete="off"
                                name="name"
                                required
                                onChange={(e) => setUser(e.target.value)}
                            />
                            <div><ion-icon name="person"></ion-icon></div>
                        </div>
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
                        <button type="submit">Register</button>
                        <div className="lr-link">
                            <p>
                                Already have an account?
                                <Link to="/">Log In</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
