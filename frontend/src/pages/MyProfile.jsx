import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
    const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(null);

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();

            formData.append("name", userData.name);
            formData.append("phone", userData.phone);
            formData.append("address", JSON.stringify(userData.address));
            formData.append("gender", userData.gender);
            formData.append("dob", userData.dob);
            formData.append("age", userData.age);
            formData.append("econtact", userData.econtact);
            formData.append("premedical", userData.premedical);
            formData.append("allergy", userData.allergy);
            formData.append("blood", userData.blood);

            if (image) formData.append("image", image);

            const { data } = await axios.post(
                backendUrl + "/api/user/update-profile",
                formData,
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
                setIsEdit(false);
                setImage(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while updating profile.");
        }
    };

    return userData && (
        <div className="max-w-4xl mx-auto my-10 p-8 bg-gray-50 shadow-md rounded-lg flex flex-col gap-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
                {isEdit ? (
                    <label htmlFor="image">
                        <div className="inline-block relative cursor-pointer">
                            <img
                                className="w-36 rounded opacity-75"
                                src={image ? URL.createObjectURL(image) : userData.image}
                                alt="Profile Preview"
                            />
                            <img
                                className="w-10 absolute bottom-12 right-12"
                                src={assets.upload_icon}
                                alt="Upload"
                            />
                        </div>
                        <input
                            onChange={(e) => setImage(e.target.files[0])}
                            type="file"
                            id="image"
                            hidden
                        />
                    </label>
                ) : (
                    <img
                        src={userData.image}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 transition-transform duration-300 hover:scale-110 cursor-pointer"
                    />
                )}

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
                                ...prev,
                                address: { ...prev.address, line1: e.target.value }
                            }))}
                        />
                        <input
                            type="text"
                            className="border p-2 rounded-md w-64 bg-white"
                            value={userData.address.line2}
                            onChange={(e) => setUserData(prev => ({
                                ...prev,
                                address: { ...prev.address, line2: e.target.value }
                            }))}
                        />
                    </div>
                ) : (
                    <p>{userData.address.line1}<br />{userData.address.line2}</p>
                )}
            </div>

            {/* Basic Information */}
            <div className="text-gray-700">
                <h2 className="text-xl font-semibold border-b pb-2 mb-4">Basic Information</h2>

                <p><strong>Gender:</strong> {isEdit ? (
                    <select
                        className="border p-2 rounded-md w-64 bg-white"
                        value={userData.gender}
                        onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                ) : userData.gender}</p>

                <p><strong>Date of Birth:</strong> {isEdit ? (
                    <input
                        type="date"
                        className="border p-2 rounded-md w-64 bg-white"
                        value={userData.dob}
                        onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                    />
                ) : userData.dob}</p>

                <p><strong>Age:</strong> {isEdit ? (
                    <input
                        type="number"
                        className="border p-2 rounded-md w-64 bg-white"
                        value={userData.age}
                        onChange={(e) => setUserData(prev => ({ ...prev, age: e.target.value }))}
                    />
                ) : userData.age}</p>

                <p><strong>Emergency Contact:</strong> {isEdit ? (
                    <input
                        type="text"
                        className="border p-2 rounded-md w-64 bg-white"
                        value={userData.econtact}
                        onChange={(e) => setUserData(prev => ({ ...prev, econtact: e.target.value }))}
                    />
                ) : userData.econtact}</p>

                <p><strong>Pre Medical:</strong> {isEdit ? (
                    <input
                        type="text"
                        className="border p-2 rounded-md w-64 bg-white"
                        value={userData.premedical}
                        onChange={(e) => setUserData(prev => ({ ...prev, premedical: e.target.value }))}
                    />
                ) : userData.premedical}</p>

                <p><strong>Allergy:</strong> {isEdit ? (
                    <input
                        type="text"
                        className="border p-2 rounded-md w-64 bg-white"
                        value={userData.allergy}
                        onChange={(e) => setUserData(prev => ({ ...prev, allergy: e.target.value }))}
                    />
                ) : userData.allergy}</p>

                <p><strong>Blood Group:</strong> {isEdit ? (
                    <input
                        type="text"
                        className="border p-2 rounded-md w-64 bg-white"
                        value={userData.blood}
                        onChange={(e) => setUserData(prev => ({ ...prev, blood: e.target.value }))}
                    />
                ) : userData.blood}</p>
            </div>

            {/* Edit/Save Button */}
            <div className="flex justify-center">
                {isEdit ? (
                    <button
                        onClick={updateUserProfileData}
                        className="bg-green-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-600 transition-all"
                    >
                        Save Information
                    </button>
                ) : (
                    <button
                        onClick={() => setIsEdit(true)}
                        className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600 transition-all"
                    >
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
};

export default MyProfile;
