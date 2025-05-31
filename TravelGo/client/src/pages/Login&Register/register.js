import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

import backgroundImage from "../../assets/lr-bg.jpg";

export default function Register() {
    const [user, setUser] = useState(""); // State to store the username
    const [email, setEmail] = useState(""); // State to store the email
    const [password, setPassword] = useState(""); // State to store the password
    const [error, setError] = useState(""); // State to store any error messages
    const navigate = useNavigate(); // Hook to programmatically navigate to different routes

    // Display error message for 3 seconds if there is an error
    useEffect(() => {
        if (error) {
            setTimeout(() => setError(""), 3000); // Clear the error message after 3 seconds
        }
    }, [error]);

    // Function to handle form submission
    // It sends a POST request to the backend server with the username, email and password
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        axiosInstance
            .post("/users/register", { // send registration request to backend server
                name: user,
                email: email,
                password: password,
            })
            .then((res) => {
                console.log(res.data);
                if (res.data) { // If registration is successful, navigate to the login page
                    navigate("/", {
                        state: {
                            fromRegister: true,
                            message: "Registration successful! Please log in."
                        }
                    });
                }
            })
            .catch((err) => {
                const message = err.response?.data?.message || "Something went wrong. Please try again.";
                console.error("Registration error:", message);
                setError(message);
            });
    };

    return (
        <div className="start-div-block">
            <img src={backgroundImage} alt="Background" className="absolute inset-0 w-full h-full opacity-50 object-cover" />
            <div className="relative z-10 w-[420px] h-[450px] bg-transparent items-center flex ">
                <div className="w-full p-10">
                    <form name="register" onSubmit={handleSubmit}>
                        <h1 className="text-4xl text-center">Register</h1>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Username"
                                autoComplete="off"
                                name="name"
                                required
                                className="input-box-input"
                                onChange={(e) => setUser(e.target.value)}
                            />
                            <div className="input-box-icon"><ion-icon name="person"></ion-icon></div>
                        </div>
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
                        <button type="submit" className="w-full h-11 bg-peach border-none outline-none rounded-[40px] text-lg cursor-pointer font-semibold hover:opacity-75 hover:shadow-[rgba(0,0,0,0.2)_0_0_10px]">Register</button>
                        <div className="text-sm mt-5 mb-4 text-center">
                            <p>
                                Already have an account?
                                <Link to="/" className="font-semibold pl-1 hover:underline">Log In</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
