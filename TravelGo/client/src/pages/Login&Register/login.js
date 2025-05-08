import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./login&register.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Function to handle form submission
    // It sends a POST request to the backend server with the email and password
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        axios
            .post("http://localhost:5000/api/users/login", { // send login request to backend server
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
        <div className="lr">
            <div className="lr-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
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
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Log In</button>
                </form>
                <div className="lr-link">
                    <p>
                        Don't have an account? <Link to="/register">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
