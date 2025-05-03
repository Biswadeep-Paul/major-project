import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router";

// Helper function for AI-based recommendations
const calculateSimilarity = (doc, targetDoc) => {
    let score = 0;

    if (!targetDoc) return 0;

    const docExperience = parseFloat(doc.experience) || 1;
    const targetExperience = parseFloat(targetDoc.experience) || 1;
    const docRating = parseFloat(doc.rating) || 1;
    const targetRating = parseFloat(targetDoc.rating) || 1;

    // 1️⃣ Same Speciality - Higher Weight
    if (doc.speciality === targetDoc.speciality) score += 5;

    // 2️⃣ Experience Similarity
    if (targetExperience > 0) {
        score += (Math.min(docExperience, targetExperience) / Math.max(docExperience, targetExperience)) * 3;
    }

    // 3️⃣ Rating Similarity
    if (targetRating > 0) {
        score += (Math.min(docRating, targetRating) / Math.max(docRating, targetRating)) * 2;
    }

    // 4️⃣ Location Match - Medium Weight
    if (doc.location && targetDoc.location && doc.location === targetDoc.location) {
        score += 3;
    }

    return score;
};

const RelatedDoctors = ({ speciality, docId }) => {
    const { doctors } = useContext(AppContext);
    const navigate = useNavigate();
    const [relDoc, setRelDoc] = useState([]);

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const targetDoctor = doctors.find(doc => doc._id === docId);
            const doctorData = doctors
                .filter(doc => doc._id !== docId)
                .map(doc => ({
                    ...doc,
                    similarityScore: calculateSimilarity(doc, targetDoctor)
                }))
                .filter(doc => doc.similarityScore >= 5)
                .sort((a, b) => b.similarityScore - a.similarityScore)
                .slice(0, 5);

            setRelDoc(doctorData);
        }
    }, [doctors, speciality, docId]);

    return (
        <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
            <h1 className="text-3xl font-medium">AI Recommended Doctors</h1>
            <p className="sm:w-1/3 text-center text-sm">Based on experience, rating, specialization, and location.</p>
            
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-6">
                {relDoc.length > 0 ? (
                    relDoc.map((item, index) => (
                        <div
                            onClick={() => {
                                navigate(`/appointment/${item._id}`);
                                window.scrollTo(0, 0);
                            }}
                            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500"
                            key={index}
                        >
                            <img
                                className="bg-blue-50 w-full h-48 object-cover"
                                src={item.image || "/default-doctor.png"}
                                alt={`Dr. ${item.name}`}
                            />
                            <div className="p-4">
                                <div className="flex items-center gap-2 text-sm text-green-500">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <p>Available</p>
                                </div>
                                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                                <p className="text-gray-600 text-sm">{item.speciality}</p>
                                <p className="text-gray-500 text-sm">{item.location}</p>
                                <p className="text-gray-400 text-xs">Similarity Score: {item.similarityScore.toFixed(2)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No doctors found with a high enough similarity score.</p>
                )}
            </div>

            <button
                onClick={() => {
                    navigate("/doctors");
                    window.scrollTo(0, 0);
                }}
                className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
            >
                More
            </button>
        </div>
    );
};

export default RelatedDoctors;