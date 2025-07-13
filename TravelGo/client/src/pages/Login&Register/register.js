import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import backgroundImage from "../../assets/lr-bg.jpg";

export default function Register() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            setTimeout(() => setError(""), 3000);
        }
    }, [error]);

    // send a POST request to backend server with 3 info: username, email & password
    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!validateEmail(email)) {
            setError("Invalid email");
            return;
        }

        axiosInstance
            .post("/users/register", {
                name: user,
                email: email,
                password: password,
            })
            .then((res) => {
                if (res.data.success) {
                    navigate("/", {
                        state: {
                            fromRegister: true,
                            message: "Registration successful! Please log in."
                        }
                    });
                }
            })
            .catch((err) => {
                const message = ("Password too weak. " + err.response?.data?.feedback?.[0]) || err.response?.data?.message || "Something went wrong. Please try again.";
                console.error("Registration error:", message);
                setError(message);
            });
    };

    return (
        <div className="login-register">
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
                            error && <div className="error">{error}</div>
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
