import React, { useState } from "react";
import { assets } from "../assets/assets";

const MyProfile = () => {
    const [userData, setUserData] = useState({
        name: "Edward Vincent",
        image: assets.profile_pic,
        email: "richardjameswap@gmail.com",
        phone: "+1 123 456 7890",
        address: {
            line1: "57th Cross, Richmond",
            line2: "Circle, Church Road, London"
        },
        gender: "Male",
        dob: "2000-01-20"
    });

    const [isEdit, setIsEdit] = useState(false);

    return (
        <div className="max-w-4xl mx-auto my-10 p-8 bg-gray-50 shadow-md rounded-lg flex flex-col gap-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
                <img 
                    src={userData.image} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 transition-transform duration-300 hover:scale-110 cursor-pointer"
                />
                {isEdit ? (
                    <input 
                        type="text" 
                        className="mt-3 text-center text-lg font-semibold border p-2 rounded-md w-64 bg-white"
                        value={userData.name} 
                        onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} 
                    />
                ) : (
                    <p className="mt-3 text-2xl font-semibold text-gray-700">{userData.name}</p>
                )}
            </div>

            {/* Contact Information */}
            <div className="text-gray-700">
                <h2 className="text-xl font-semibold border-b pb-2 mb-4">Contact Information</h2>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Phone:</strong> {isEdit ? (
                    <input 
                        type="text" 
                        className="border p-2 rounded-md w-64 bg-white" 
                        value={userData.phone} 
                        onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} 
                    />
                ) : userData.phone}</p>
                <p><strong>Address:</strong></p>
                {isEdit ? (
                    <div className="flex flex-col gap-2">
                        <input 
                            type="text" 
                            className="border p-2 rounded-md w-64 bg-white" 
                            value={userData.address.line1} 
                            onChange={(e) => setUserData(prev => ({
                                ...prev, address: { ...prev.address, line1: e.target.value }
                            }))} 
                        />
                        <input 
                            type="text" 
                            className="border p-2 rounded-md w-64 bg-white" 
                            value={userData.address.line2} 
                            onChange={(e) => setUserData(prev => ({
                                ...prev, address: { ...prev.address, line2: e.target.value }
                            }))} 
                        />
                    </div>
                ) : (
                    <p>{userData.address.line1} <br /> {userData.address.line2}</p>
                )}
            </div>

            {/* Basic Information */}
            <div className="text-gray-700">
                <h2 className="text-xl font-semibold border-b pb-2 mb-4">Basic Information</h2>
                <p><strong>Gender:</strong> {isEdit ? (
                    <select 
                        className="border p-2 rounded-md w-64 bg-white" 
                        onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                        value={userData.gender}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                ) : userData.gender}</p>
                <p><strong>Date of Birth:</strong> {isEdit ? (
                    <input 
                        type="date" 
                        className="border p-2 rounded-md w-64 bg-white" 
                        onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                        value={userData.dob}
                    />
                ) : userData.dob}</p>
            </div>

            {/* Edit/Save Button */}
            <div className="flex justify-center">
                {isEdit ? (
                    <button 
                        onClick={() => setIsEdit(false)}
                        className="bg-green-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-600 transition-all"
                    >
                        Save Information
                    </button>
                ) : (
                    <button 
                        onClick={() => setIsEdit(true)}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600 transition-all"
                    >
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
};

export default MyProfile;