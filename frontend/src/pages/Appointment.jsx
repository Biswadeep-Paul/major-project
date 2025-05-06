import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";
import { Clock, CalendarDays } from "lucide-react";


const Appointment = () => {
    const { docId } = useParams();
    const { userData, doctors, getRatingsData, ratings, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const Months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    const navigate = useNavigate();

    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [rating, setRating] = useState('');
    const [review, setReview] = useState('');

    useEffect(() => {
        const doc = doctors.find(doc => doc._id === docId);
        setDocInfo(doc);
    }, [doctors, docId]);

    useEffect(() => {
        if (!docInfo) return;
        generateAvailableSlots();
    }, [docInfo]);


    useEffect(() => {
        if (docId) {
            getRatingsData(docId); // This will fetch ratings when the component loads
        }
    }, [docId, getRatingsData]); // Add getRatingsData to dependencies


    // const generateAvailableSlots = () => {
    //     const slots = [];
    //     const today = new Date();

    //     for (let i = 0; i < 7; i++) {
    //         const currentDate = new Date();
    //         currentDate.setDate(today.getDate() + i);

    //         const endTime = new Date();
    //         endTime.setDate(today.getDate() + i);
    //         endTime.setHours(21, 0, 0, 0);

    //         if (today.getDate() === currentDate.getDate()) {
    //             currentDate.setHours(Math.max(10, currentDate.getHours() + 1));
    //             currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
    //         } else {
    //             currentDate.setHours(10);
    //             currentDate.setMinutes(0);
    //         }

    //         const timeSlots = [];
    //         while (currentDate < endTime) {
    //             timeSlots.push({
    //                 datetime: new Date(currentDate),
    //                 time: currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    //             });
    //             currentDate.setMinutes(currentDate.getMinutes() + 30);
    //         }

    //         if (timeSlots.length > 0) slots.push(timeSlots);
    //     }

    //     setDocSlots(slots);
    // };
    const generateAvailableSlots = () => {
        const slots = [];
        const today = new Date();
        
        // Get doctor's preferences or use defaults
        const daysPref = docInfo.preferredDays || ['MON', 'TUE', 'WED', 'THU', 'FRI'];
        const startTime = docInfo.preferredHours?.start || '09:00';
        const endTime = docInfo.preferredHours?.end || '17:00';
        
        // Convert start/end times to hours and minutes
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
    
        for (let i = 0; i < 14; i++) { // Show 2 weeks of availability
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            const dayName = daysOfWeek[currentDate.getDay()];
            
            // Only show days the doctor prefers
            if (!daysPref.includes(dayName)) continue;
    
            const timeSlots = [];
            const slotDate = new Date(currentDate);
            
            // Set start time
            slotDate.setHours(startHour, startMin, 0, 0);
            
            // Set end time
            const slotEnd = new Date(currentDate);
            slotEnd.setHours(endHour, endMin, 0, 0);
            
            // Generate time slots
            while (slotDate < slotEnd) {
                timeSlots.push({
                    datetime: new Date(slotDate),
                    time: slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
                slotDate.setMinutes(slotDate.getMinutes() + 30);
            }
    
            if (timeSlots.length > 0) {
                slots.push(timeSlots);
            }
        }
    
        setDocSlots(slots);
    };
    const bookAppointment = async () => {
        if (!token) {
            toast.warn('Login to Book Appointment');
            return navigate('/login');
        }

        if (!slotTime) {
            toast.error('Please select a time slot');
            return;
        }

        try {
            const date = docSlots[slotIndex][0].datetime;
            const day = date.getDate();
            const month = date.getMonth();
            const year = date.getFullYear();
            const slotDate = `${day}_${month}_${year}`;

            const { data } = await axios.post(
                backendUrl + '/api/user/book-appointment',
                { docId, slotDate, slotTime },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                getDoctorsData();
                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error booking appointment');
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.warn('Login to Rate Doctor');
            return navigate('/login');
        }

        try {
            const { data } = await axios.post(
                backendUrl + '/api/doctor/rate',
                {
                    userId: userData._id,
                    doctorId: docInfo._id,
                    rating,
                    review
                },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                setRating('');
                setReview('');
                getDoctorsData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error('Something went wrong. Please try again.');
        }
    };


    const calculateAverageRating = () => {
        if (!ratings || ratings.length === 0) return 0;
        const sum = ratings.reduce((total, item) => total + item.rating, 0);
        return sum / ratings.length;
    };

    return docInfo && (
        <div className="p-4 sm:p-8">

            {/* Doctor Details */}
            <div className="flex flex-col sm:flex-row gap-6 bg-white shadow-lg rounded-lg p-6">
                <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt={docInfo.name} />

                <div className="flex-1">
                    <div className={`flex items-center gap-2 text-sm ${docInfo.available ? "text-green-500" : "text-red-500"}`}>
                        <p className={`w-2 h-2 rounded-full ${docInfo.available ? "bg-green-500 animate-ping" : "bg-red-500"}`}></p>
                        <p>{docInfo.available ? "Available" : "Not Available"}</p>
                    </div>
                    <p className="flex items-center gap-2 text-2xl font-semibold text-gray-900 mt-2">
                        {docInfo.name}
                        <img className="w-5" src={assets.verified_icon} alt="Verified" />
                    </p>
                    <p className="text-gray-600 text-sm">
                        {generateStars(calculateAverageRating())}
                        <span className="ml-1 text-gray-500">
                            ({calculateAverageRating().toFixed(1)} • {ratings?.length || 0} reviews)
                        </span>
                    </p>

                    <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        
                        <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
                    </div>
                    
                    
                    <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">


                        {/* <p>{docInfo.location}</p> */}

                        <p>{docInfo.location}</p>


                        {/* <p>{docInfo.location}</p> */}

                        
                    </div>

                    <div className="mt-4">
                        <p className="flex items-center gap-1 text-sm font-medium text-gray-900">
                            About
                            <img src={assets.info_icon} alt="Info" />
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{docInfo.about}</p>
                    </div>
                    

<div className="mt-6">
  <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 uppercase tracking-wider">
    <CalendarDays className="w-4 h-4 text-purple-500" />
    Timing & Availability
  </div>

  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-gray-50 border border-gray-200 rounded-lg p-4">
    {/* Days */}
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-medium text-gray-700">Days:</span>
      {(Array.isArray(docInfo.preferredDays) ? docInfo.preferredDays : ['MON', 'TUE', 'WED', 'THU', 'FRI']).map((day, index) => (
        <span
          key={index}
          className="bg-purple-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-semibold"
        >
          {day}
        </span>
      ))}
    </div>

    {/* Time */}
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4 text-purple-500" />
      <span className="text-sm text-gray-700">
        {docInfo.preferredHours?.start || "09:00"} - {docInfo.preferredHours?.end || "17:00"}
      </span>
    </div>
  </div>
</div>

                    <p className="text-gray-500 font-medium mt-4">
                        Appointment Fee: <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span>
                    </p>
                </div>
            </div>

            {/* Booking Slots */}
            <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
                <p className="text-lg font-semibold text-gray-700">Booking Slots</p>

                {docSlots.length === 0 ? (
                    <p className="text-gray-500 mt-4">No slots available</p>
                ) : (
                    <>
                        <div className="flex gap-3 items-center w-full overflow-x-auto mt-4">
                            {docSlots.map((slots, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setSlotIndex(index);
                                        setSlotTime('');
                                    }}
                                    className={`text-center py-4 px-3 min-w-16 rounded-full cursor-pointer 
                                        ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-300'}`}
                                >
                                    <p>{daysOfWeek[slots[0].datetime.getDay()]}</p>
                                    <p className="font-bold text-2xl">{slots[0].datetime.getDate()}</p>
                                    <p>{Months[slots[0].datetime.getMonth()]}</p>
                                </div>
                            ))}
                        </div>

                        {/* Time Slots */}
                        {docSlots[slotIndex]?.length > 0 ? (
                            <div className="flex gap-3 w-full overflow-x-auto mt-4 pb-5"> {/* Added pb-4 for spacing */}
                                {docSlots[slotIndex].map((slot, index) => {
                                    const date = slot.datetime;
                                    const slotDate = `${date.getDate()}_${date.getMonth()}_${date.getFullYear()}`;
                                    const bookedSlots = docInfo?.slots_booked?.[slotDate] || [];
                                    const isBooked = bookedSlots.includes(slot.time);
                                    const isSelected = slot.time === slotTime;

                                    return (
                                        <div key={index} className="relative flex flex-col items-center">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (!isBooked) setSlotTime(slot.time);
                                                }}
                                                className={`text-sm px-5 py-2 rounded-lg cursor-pointer select-none w-full min-w-[90px] transition-colors ${isBooked
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : isSelected
                                                            ? 'bg-primary text-white'
                                                            : 'border border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                disabled={isBooked}
                                            >
                                                {slot.time.toLowerCase()}
                                            </button>
                                            {isBooked && (
                                                <div className="absolute -bottom-5 left-0 right-0 flex justify-center">
                                                    <span className="text-xs text-red-500 font-medium bg-white px-2 py-0.5 rounded-full border border-red-100 shadow-sm">
                                                        Booked
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 mt-4">No slots available for this day</p>
                        )}
                    </>
                )}

                <button
                    onClick={bookAppointment}
                    className="bg-primary text-white text-sm px-6 py-3 rounded-lg mt-6"
                >
                    Book An Appointment
                </button>
            </div>

            {/* Rate the Doctor */}
            <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
                <p className="text-lg font-semibold text-gray-700 mb-4">Rate the Doctor</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating:</label>
                        <select
                            id="rating"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select Rating</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="review" className="block text-sm font-medium text-gray-700">Review:</label>
                        <textarea
                            id="review"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            rows="4"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            placeholder="Write your feedback..."
                        ></textarea>
                    </div>

                    <button type="submit" className="bg-primary text-white py-2 rounded-lg">
                        Submit Rating
                    </button>
                </form>
            </div>

            {/* Patient Reviews */}
            {/* Patient Reviews */}
            <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
                <p className="text-lg font-semibold text-gray-700 mb-4">Patient Reviews</p>

                {ratings && ratings.length > 0 ? (
                    <div className={`flex flex-col gap-4 ${ratings.length > 5 ? 'max-h-96 overflow-y-auto' : ''}`}>
                        {ratings.map((rating, index) => (
                            <div key={index} className="border-b pb-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-gray-800 font-medium">
                                        {rating.userId?.name || 'Anonymous'}
                                    </p>
                                    <div className="text-yellow-500">
                                        {generateStars(rating.rating)}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mt-1">{rating.review}</p>
                                <p className="text-gray-600 text-sm mt-1">{rating.avgRating}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No reviews yet</p>
                )}
            </div>

            {/* Related Doctors */}
            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
    );
};

export default Appointment;
