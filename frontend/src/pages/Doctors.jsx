import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
    const { speciality } = useParams();
    const navigate = useNavigate();
    const { doctors, getRatingsData } = useContext(AppContext);

    const [filterDoc, setFilterDoc] = useState([]);
    const [doctorRatingsMap, setDoctorRatingsMap] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    // States for showing more filter options
    const [expanded, setExpanded] = useState({
        speciality: false,
        location: false,
        experience: false,
        fees: false,
    });

    // Store dynamic filter values
    const [filterValues, setFilterValues] = useState({
        speciality: [],
        location: [],
        experience: [],
        fees: [],
    });

    // Selected filters
    const [selectedFilters, setSelectedFilters] = useState({
        speciality: speciality || "",
        location: "",
        experience: "",
        fees: "",
    });

    // Extract unique filter values from doctors data
    useEffect(() => {
        const specialities = [...new Set(doctors.map(doc => doc.speciality).filter(Boolean))];
        const locations = [...new Set(doctors.map(doc => doc.location).filter(Boolean))];
        const experiences = [...new Set(doctors.map(doc => doc.experience).filter(Boolean))].sort((a, b) => a - b);
        const fees = [...new Set(doctors.map(doc => doc.fees).filter(Boolean))].sort((a, b) => a - b);

        setFilterValues({
            speciality: specialities,
            location: locations,
            experience: experiences,
            fees: fees,
        });
    }, [doctors]);

    // Filter logic
    useEffect(() => {
        let filtered = [...doctors];

        if (selectedFilters.speciality) {
            filtered = filtered.filter(doc => doc.speciality === selectedFilters.speciality);
        }

        if (selectedFilters.location) {
            filtered = filtered.filter(doc => doc.location === selectedFilters.location);
        }

        if (selectedFilters.experience) {
            filtered = filtered.filter(doc => doc.experience === selectedFilters.experience);
        }

        if (selectedFilters.fees) {
            filtered = filtered.filter(doc => doc.fees === selectedFilters.fees);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(doc => {
                const name = doc.name?.toLowerCase() || '';
                const docSpeciality = doc.speciality?.toLowerCase() || '';
                const location = doc.location?.toLowerCase() || '';
                return (
                    name.includes(term) ||
                    docSpeciality.includes(term) ||
                    location.includes(term)
                );
            });
        }

        setFilterDoc(filtered);
    }, [doctors, selectedFilters, searchTerm]);

    // Fetch ratings
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

    const renderFilterSection = (title, key) => {
        const items = filterValues[key];
        const isExpanded = expanded[key];
        const showItems = isExpanded ? items : items.slice(0, 5);
        const extraCount = items.length - 5;

        return (
            <div className="mb-6">
                <h2 className="text-md font-semibold text-gray-800 mb-2">{title}</h2>
                <div className="flex flex-col gap-2">
                    {showItems.map((item) => (
                        <button
                            key={item}
                            onClick={() => {
                                const newFilters = { ...selectedFilters, [key]: selectedFilters[key] === item ? "" : item };
                                setSelectedFilters(newFilters);
                                if (key === 'speciality') navigate(`/doctors/${newFilters[key] || ''}`);
                            }}
                            className={`text-left px-3 py-2 rounded-lg transition-all text-sm ${
                                selectedFilters[key] === item ? "bg-blue-100 text-blue-700 font-medium" : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                    {extraCount > 0 && !isExpanded && (
                        <button
                            className="text-blue-600 text-sm mt-1 hover:underline"
                            onClick={() => setExpanded(prev => ({ ...prev, [key]: true }))}
                        >
                            +{extraCount} more
                        </button>
                    )}
                    {isExpanded && items.length > 5 && (
                        <button
                            className="text-blue-600 text-sm mt-1 hover:underline"
                            onClick={() => setExpanded(prev => ({ ...prev, [key]: false }))}
                        >
                            Show less
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Search */}
            <div className="w-full mb-8">
                <div className="flex flex-col">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Find A <span className="text-transparent bg-clip-text bg-primary">Doctor</span>
                </h2>
                    <p className="text-gray-600 mb-4">Browse through our specialist doctors</p>
                    <input
                        type="text"
                        placeholder="Search by name, speciality or location..."
                        className="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters */}
                <div className="lg:w-1/4">
                    {renderFilterSection("Speciality", "speciality")}
                    {renderFilterSection("Location", "location")}
                    {renderFilterSection("Experience (years)", "experience")}
                    {renderFilterSection("Consultation Fees (Rs.)", "fees")}
                </div>

                {/* Doctors List */}
                <div className="lg:w-3/4">
                    {filterDoc.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No doctors found matching your criteria</p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedFilters({ speciality: "", location: "", experience: "", fees: "" });
                                    navigate('/doctors');
                                }}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filterDoc.map((doctor) => {
                                const averageRating = doctorRatingsMap[doctor._id] || 0;

                                return (
                                    <div
                                        onClick={() => navigate(`/appointment/${doctor._id}`)}
                                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                        key={doctor._id}
                                    >
                                        <img 
                                            className="w-full h-48 object-cover bg-gray-100" 
                                            src={doctor.image} 
                                            alt={doctor.name} 
                                            onError={(e) => {
                                                e.target.src = '/default-doctor.jpg';
                                            }}
                                        />
                                        <div className="p-5">
                                            <div className={`flex items-center gap-2 text-sm mb-2 ${doctor.available ? "text-green-600" : "text-red-600"}`}>
                                                <span className={`w-2 h-2 rounded-full ${doctor.available ? "bg-green-500" : "bg-red-500"}`}></span>
                                                <span>{doctor.available ? "Available" : "Not Available"}</span>
                                            </div>
                                            <div className="flex items-center gap-1 mb-2">
                                                {generateStars(averageRating)}
                                                <span className="text-gray-500 text-sm ml-1">
                                                    ({averageRating.toFixed(1)})
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-1">{doctor.name}</h3>
                                            <p className="text-gray-600 mb-1">{doctor.speciality}</p>
                                            <p className="text-gray-500 text-sm mb-1">{doctor.location}</p>
                                            <p className="text-gray-500 text-sm">{doctor.experience} years experience</p>
                                            {/* <p className="text-gray-500 text-sm">₹{doctor.fees}</p> */}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Doctors;
