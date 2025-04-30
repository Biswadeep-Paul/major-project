import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
    const { speciality } = useParams();
    const navigate = useNavigate();
    const [filterDoc, setFilterDoc] = useState([]);
    const { doctors, ratings } = useContext(AppContext); // Include ratings from context

    useEffect(() => {
        if (speciality) {
            setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
        } else {
            setFilterDoc(doctors);
        }
    }, [doctors, speciality]);

    // Function to calculate average rating for a doctor
    const getAverageRating = (doctorId) => {
        if (!ratings || ratings.length === 0) return 0;
        
        const doctorRatings = ratings.filter(rating => rating.doctorId === doctorId);
        if (doctorRatings.length === 0) return 0;
        
        const sum = doctorRatings.reduce((total, rating) => total + rating.rating, 0);
        return sum / doctorRatings.length;
    };

    // Helper function to generate star ratings
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
                {/* Speciality filter options (unchanged) */}
                <div className="flex flex-col gap-4 text-sm text-gray-600">
                    <p
                        onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')}
                        className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black" : ""}`}
                    >
                        General Physician
                    </p>
                    <p
                        onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')}
                        className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""}`}
                    >
                        Gynecologist
                    </p>
                    <p
                        onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')}
                        className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""}`}
                    >
                        Dermatologist
                    </p>
                    <p
                        onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')}
                        className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""}`}
                    >
                        Pediatricians
                    </p>
                    <p
                        onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')}
                        className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""}`}
                    >
                        Neurologist
                    </p>
                    <p
                        onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')}
                        className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""}`}
                    >
                        Gastroenterologist
                    </p>
                </div>
                <div className="flex flex-col gap-4 text-sm text-gray-600">
                    {/* ... existing speciality buttons ... */}
                </div>

                {/* Doctors list */}
                <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
                    {filterDoc.map((doctor) => {
                        const averageRating = getAverageRating(doctor._id);
                        
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