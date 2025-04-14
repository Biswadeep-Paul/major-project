import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);

    const generateStars = (rating) => {
        const stars = [];
        const starCount = Math.min(Math.round(rating), 5); // Rating stars (filled)
        for (let i = 0; i < starCount; i++) {
            stars.push(<span key={`filled-${i}`} className="text-yellow-500">★</span>);
        }
        for (let i = starCount; i < 5; i++) {
            stars.push(<span key={`blank-${i}`} className="text-gray-300">★</span>); // Blank stars
        }
        return stars;
    };

    return (
        <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
            <h1 className="text-3xl font-medium">Top Doctors To Book</h1>
            <p className="sm:w-1/3 text-center text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-6">
                {doctors.slice(0, 10).map((item, index) => (
                    <div 
                        onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0); }} 
                        className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500" 
                        key={index}
                    >
                        <img className="bg-blue-50" src={item.image} alt="" />
                        <div className="p-4">
                            {/* Availability section with dynamic icon and text */}
                            <div className={`flex items-center gap-2 text-sm text-center ${item.available ? "text-green-500" : "text-red-500"}`}>
                                <p 
                                    className={`w-2 h-2 rounded-full ${item.available ? "bg-green-500 animate-ping" : "bg-red-500"}`}
                                ></p>
                                <p>{item.available ? "Available" : "Not Available"}</p>
                            </div>
                            
                            {/* Stars display */}
                            <div className="flex items-center gap-1">
                                {generateStars(item.averageRating)}
                            </div>
                            
                            {/* Doctor details */}
                            <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                            <p className="text-gray-600 text-sm">{item.speciality}</p>
                            {/* Removed extra availability text, handled dynamically in the section above */}
                        </div>
                    </div>
                ))}
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