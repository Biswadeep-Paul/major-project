import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";

const Login = () => {
    const { backendUrl, token, setToken } = useContext(AppContext);
    const navigate = useNavigate();

    const [mode, setMode] = useState("Sign Up");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (mode === "Sign Up") {
                const { data } = await axios.post(`${backendUrl}/api/user/register`, {
                    name,
                    email,
                    password,
                });
                if (data.success) {
                    localStorage.setItem("token", data.token);
                    setToken(data.token);
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(`${backendUrl}/api/user/login`, {
                    email,
                    password,
                });
                if (data.success) {
                    localStorage.setItem("token", data.token);
                    setToken(data.token);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        if (token) {
            navigate("/");
            toast.success("User logged in successfully");
        }
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
                    {mode === "Sign Up" ? "Create Account" : "Welcome Back"}
                </h2>

                {/* Toggle Buttons */}
                <div className="flex justify-center gap-4 mb-6">
                    {["Sign Up", "Login"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setMode(type)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition ${mode === type
                                ? "bg-primary text-white shadow"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={onSubmitHandler} className="space-y-4">
                    {mode === "Sign Up" && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {mode === "Login" && (
                        <div className="flex justify-between text-sm font-medium">
                            <Link to="#" className="text-primary hover:underline">
                                Forgot Password?
                            </Link>
                            <Link to="#" className="text-primary hover:underline">
                                Reset Password?
                            </Link>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 rounded text-white bg-primary hover:bg-primary-dark transition"
                    >
                        {mode === "Sign Up" ? "Create Account" : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
