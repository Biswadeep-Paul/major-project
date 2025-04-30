import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import HealthCard from "./HealthCard";
import { useNavigate } from "react-router";


const HealthCardGenerator = ({ name, age, gender, bloodGroup, emergencyContact, address, previewPhoto, cardNumber }) => {

    const { userData } = useContext(AppContext)
    const navigate = useNavigate()

    // const handlePrint = () =>{
        
    //     window.print()
    // }


    useEffect(() => {
        // Check if navigation was triggered for printing
        const shouldPrint = localStorage.getItem("navigateToPrint") === "true";
    
        if (shouldPrint) {
          // Trigger the print dialog
          window.print();
    
          // Clear the flag after printing
          localStorage.setItem("navigateToPrint", "false");

          navigate('/healthcard')
        }

        
      }, []);
    

    return (

    <div className="w-full max-w-2xl">
        <div className="w-full max-w-2xl bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200">
            {/* Aether Care Banner */}
            <div className="bg-primary p-4 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="bg-white p-1 rounded-full">
                        {/* Logo placeholder - replace with actual logo */}
                        <img
                            src={assets.logo2} // Replace with your actual logo path
                            alt="Aether Care Logo"
                            className="h-10 w-10 object-contain"
                        />
                    </div>
                    <h2 className="text-xl font-bold">AETHER CARE</h2>
                </div>
                <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                    Health ID: {userData._id}
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Profile Photo */}
                <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                        {userData.image ? (
                            <img
                                src={userData.image}
                                alt="User"
                                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-lg"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-4xl font-bold shadow-lg">
                                {userData.name ? userData.name.charAt(0).toUpperCase() : "?"}
                            </div>
                        )}
                    </div>

                    {/* QR Code Placeholder */}
                    <div className="mt-4 p-2 bg-white border border-gray-200 rounded-lg">
                        <div className="w-32 h-32 bg-gray-100 flex items-center justify-center text-gray-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-20 w-20"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                                />
                            </svg>
                        </div>
                        <p className="text-xs text-center mt-1 text-gray-500">Scan QR for health records</p>
                    </div>
                </div>

                {/* Right Column - Details */}
                <div className="md:col-span-2">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-2">{userData.name || "Full Name"}</h3>
                            {userData.blood && (
                                <div className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full mb-3">
                                    Blood Group: {userData.blood}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Age</h4>
                                <p className="text-lg font-medium">{userData.age || "--"}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</h4>
                                <p className="text-lg font-medium">{userData.gender || "--"}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Emergency Contact</h4>
                                <p className="text-lg font-medium">{userData.econtact || "--"}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Card Number</h4>
                                <p className="text-lg font-medium">{userData._id ? userData._id.slice(-6) : "--"}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</h4>
                            <p className="text-sm font-medium mt-1 whitespace-pre-line">
                                {userData.address ? `${userData.address.line1 || "--"}\n${userData.address.line2 || "--"}` : "--"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">
                                <p>Issued: {new Date().toLocaleDateString()}</p>
                                <p>Valid until: {new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toLocaleDateString()}</p>
                            </div>
                            <div className="text-xs text-gray-500 text-right">
                                <p>In case of emergency, present this card</p>
                                <p>to medical personnel.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           
        </div>
        {/* <div className="py-5">

        <button
        onClick={handlePrint}
                                
                                className="bg-primary text-white font-medium py-2 px-6 rounded-lg shadow transition-colors duration-300"
                            >
                                Generate Card
                            </button>
        </div> */}
    </div>
    );
};


export default HealthCardGenerator;