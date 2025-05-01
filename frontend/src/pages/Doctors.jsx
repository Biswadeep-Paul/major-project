import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
    const { speciality } = useParams();
    const navigate = useNavigate();
    const [filterDoc, setFilterDoc] = useState([]);
    const [doctorRatingsMap, setDoctorRatingsMap] = useState({});
    const { doctors, getRatingsData } = useContext(AppContext);

    useEffect(() => {
        if (speciality) {
            setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
        } else {
            setFilterDoc(doctors);
        }
    }, [doctors, speciality]);

    useEffect(() => {
        const fetchAllRatings = async () => {
            const ratingsObj = {};
            const docIds = filterDoc.map(doc => doc._id);

            for (const id of docIds) {
                const res = await getRatingsData(id);
                if (res?.avgRating !== undefined) {
                    ratingsObj[id] = res.avgRating;
                }
            }

            setDoctorRatingsMap(ratingsObj);
        };

        if (filterDoc.length > 0) {
            fetchAllRatings();
        }
    }, [filterDoc]);

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
        <div>
            <p className="text-gray-600">Browse through the doctors specialist.</p>
            <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
                {/* Filters left section */}
                <div className="flex flex-col gap-4 text-sm text-gray-600">
                    {["General physician", "Gynecologist", "Dermatologist", "Pediatricians", "Neurologist", "Gastroenterologist"].map((type) => (
                        <p
                            key={type}
                            onClick={() => speciality === type ? navigate('/doctors') : navigate(`/doctors/${type}`)}
                            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === type ? "bg-indigo-100 text-black" : ""}`}
                        >
                            {type}
                        </p>
                    ))}
                </div>

                {/* Doctors list */}
                <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
                    {filterDoc.map((doctor) => {
                        const averageRating = doctorRatingsMap[doctor._id] || 0;

                        return (
                            <div
                                onClick={() => navigate(`/appointment/${doctor._id}`)}
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
                                        {generateStars(averageRating)}
                                        <span className="text-gray-500 text-xs ml-1">
                                            ({averageRating.toFixed(1)})
                                        </span>
                                    </div>
                                    <p className="text-gray-900 text-lg font-medium mt-1">{doctor.name}</p>
                                    <p className="text-gray-600 text-sm">{doctor.speciality}</p>
                                    <p className="text-gray-600 text-sm">{doctor.experience} years experience</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Doctors;
