import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
    const navigate = useNavigate();
    const { doctors, getRatingsData } = useContext(AppContext);
    const [doctorRatingsMap, setDoctorRatingsMap] = useState({});

    useEffect(() => {
        const fetchRatings = async () => {
            const topDoctors = doctors.slice(0, 10);
            const ratingsObj = {};

            for (const doctor of topDoctors) {
                const res = await getRatingsData(doctor._id);
                if (res?.avgRating !== undefined) {
                    ratingsObj[doctor._id] = res.avgRating;
                }
            }

            setDoctorRatingsMap(ratingsObj);
        };

        if (doctors.length > 0) {
            fetchRatings();
        }
    }, [doctors]);

    const generateStars = (rating) => {
        const stars = [];
        const starCount = Math.min(Math.round(rating), 5);
        for (let i = 0; i < starCount; i++) {
            stars.push(<span key={`filled-${i}`} className="text-yellow-500">★</span>);
        }
        for (let i = starCount; i < 5; i++) {
            stars.push(<span key={`blank-${i}`} className="text-gray-300">★</span>);
        }
        return stars;
    };

    return (
        <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Top Doctors <span className="text-transparent bg-clip-text bg-primary">To Book</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
                Book Best Doctors with top class facility at your FingerTips.
            </p>
            <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-6">
                {doctors.slice(0, 10).map((doctor) => {
                    const avgRating = doctorRatingsMap[doctor._id] || 0;

                    return (
                        <div
                            onClick={() => { navigate(`/appointment/${doctor._id}`); scrollTo(0, 0); }}
                            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
                            key={doctor._id}
                        >
                            <img className="bg-blue-50 w-full h-48 object-cover" src={doctor.image} alt={doctor.name} />
                            <div className="p-4">
                                <div className={`flex items-center gap-2 text-sm ${doctor.available ? "text-green-500" : "text-red-500"}`}>
                                    <p className={`w-2 h-2 rounded-full ${doctor.available ? "bg-green-500 animate-ping" : "bg-red-500"}`}></p>
                                    <p>{doctor.available ? "Available" : "Not Available"}</p>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                    {generateStars(avgRating)}
                                    <span className="text-gray-500 text-xs ml-1">({avgRating.toFixed(1)})</span>
                                </div>
                                <p className="text-gray-900 text-lg font-medium mt-1">{doctor.name}</p>
                                <p className="text-gray-600 text-sm">{doctor.speciality}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <button
                onClick={() => { navigate('/doctors'); scrollTo(0, 0); }}
                className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
            >
                More
            </button>
        </div>
    );
};

export default TopDoctors;
