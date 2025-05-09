import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./login&register.css";

export default function Register() {
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
        <div className="lr">
            <div className="lr-container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <p className="lr-handle">Username</p>
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            autoComplete="off"
                            name="name"
                            required
                            onChange={(e) => setUser(e.target.value)}
                        />
                    </div>
                    <p className="lr-handle">Email</p>
                    <div>
                        <input
                            type="text"
                            placeholder="Email"
                            autoComplete="off"
                            name="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <p className="lr-handle">Password</p>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            autoComplete="off"
                            name="password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {
                        error && <p className="lr-error">{error}</p> // Display error message if any
                    }
                    <button type="submit">Register</button>
                </form>
                <div className="lr-link">
                    <p>
                        Already have an account? <Link to="/">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
