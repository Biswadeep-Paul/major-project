import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Login = () => {

    const {backendUrl,token,setToken} = useContext(AppContext)
    const navigate = useNavigate()

    const [state, setState] = useState("Sign Up");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        console.log({ name, email, password, state });

        try {
            if (state === 'Sign Up') {
                
                const {data} = await axios.post(backendUrl+'/api/user/register',{name,password,email})
                if (data.success) {
                    localStorage.setItem('token', data.token)
                    setToken(data.token)
                }else{
                    toast.error(data.message)
                }
            }else{
               
                const {data} = await axios.post(backendUrl+'/api/user/login',{password,email})
                if (data.success) {
                    localStorage.setItem('token', data.token)
                    setToken(data.token)
                }else{
                    toast.error(data.message)
                }

            }
        } catch (error) {
            toast.error(error.message)
        }
    };

    useEffect(()=>{
        if(token) {
            navigate('/')
            toast.success('User logged In successfully')
        }
    },[token])


    return (
        <form 
            onSubmit={onSubmitHandler} 
            className="min-h-[80vh] flex items-center justify-center px-4"
        >
            <div className="flex flex-col gap-4 p-8 w-full max-w-sm border rounded-xl text-gray-700 shadow-lg bg-white">
                {/* Heading */}
                <h2 className="text-xl font-semibold text-center">
                    {state === "Sign Up" ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-sm text-center text-gray-500">
                    {state === "Sign Up" ? "Sign up to book appointments" : "Log in to your account"}
                </p>

                {/* Input Fields */}
                {state === "Sign Up" && (
                    <div className="flex flex-col">
                        <label className="text-sm font-medium">Full Name</label>
                        <input 
                            type="text" 
                            onChange={(e) => setName(e.target.value)} 
                            value={name} 
                            className="border p-2 rounded-md focus:outline-primary"
                            required
                        />
                    </div>
                )}

                <div className="flex flex-col">
                    <label className="text-sm font-medium">Email</label>
                    <input 
                        type="email" 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        className="border p-2 rounded-md focus:outline-primary"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium">Password</label>
                    <input 
                        type="password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        className="border p-2 rounded-md focus:outline-primary"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="w-full bg-primary text-white p-2 rounded-md font-semibold hover:bg-primary-dark transition-all"
                >
                    {state === "Sign Up" ? "Create Account" : "Login"}
                </button>

                {/* Toggle Button */}
                <p className="text-center text-sm">
                    {state === "Sign Up" ? "Already have an account?" : "Don't have an account?"} 
                    <span 
                        onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")} 
                        className="text-primary cursor-pointer font-semibold ml-1 hover:underline"
                    >
                        {state === "Sign Up" ? "Login here" : "Sign up"}
                    </span>
                </p>
            </div>
        </form>
    );
};

export default Login;
