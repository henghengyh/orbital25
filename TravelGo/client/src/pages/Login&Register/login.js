import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from '../../context/AuthContext/authcontext';
import axiosInstance from "../../utils/axiosInstance";
import backgroundImage from "../../assets/lr-bg.jpg";

export default function Login() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [password, setPassword] = useState("");
    const [popup, setPopup] = useState(false);

    const { setAuth } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.fromProtectedRoute || location.state?.fromRegister) {
            setPopup(true);
            setMessage(location.state.message)
            setTimeout(() => {
                setPopup(false);
                setMessage("")
            }, 3000);
            window.history.replaceState({}, document.title);
        }

        if (error) {
            setTimeout(() => setError(""), 3000);
        }
    }, [location.state, error])

    // send a POST request to backend server with 2 info: email & password
    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        axiosInstance
            .post("/users/login", {
                email: email,
                password: password,
            })
            .then((res) => {
                if (res.data) {
                    localStorage.setItem("token", res.data.token);
                    setAuth({
                        user: res.data.user,
                        token: res.data.token,
                        isAuthenticated: true,
                        loading: false,
                    });
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
        <div className="login-register">
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
                            error && <div className="error">{error}</div>
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
