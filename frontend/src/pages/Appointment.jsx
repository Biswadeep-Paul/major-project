
import  { useContext, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router";

import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, currencySymbol,backendUrl, token , getDoctorsData } = useContext(AppContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const navigate = useNavigate()

    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    useEffect(() => {
        const doc = doctors.find(doc => doc._id === docId);
        setDocInfo(doc);
    }, [doctors, docId]);

    useEffect(() => {
        if (!docInfo) return;
        generateAvailableSlots();
    }, [docInfo]);

    const generateAvailableSlots = () => {
        const slots = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date();
            currentDate.setDate(today.getDate() + i);

            const endTime = new Date();
            endTime.setDate(today.getDate() + i);
            endTime.setHours(21, 0, 0, 0);

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(Math.max(10, currentDate.getHours() + 1));
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            const timeSlots = [];
            while (currentDate < endTime) {
                timeSlots.push({
                    datetime: new Date(currentDate),
                    time: currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            if (timeSlots.length > 0) slots.push(timeSlots);
        }

        setDocSlots(slots);
    };


    const bookAppointment = async() =>{
        if (!token) {
            toast.warn('Login to Book Appointment')
            return navigate('/login')
        }


        try {
            const date = docSlots[slotIndex][0].datetime

            let day = date.getDate()
            let month = date.getMonth()+1
            let year = date.getFullYear()


            const slotDate = day + "_" + month + "_" + year

             console.log(slotDate);

            const {data} = await axios.post(backendUrl + '/api/user/book-appointment',{docId , slotDate ,slotTime} , {headers :{token}})

            if (data.success) {
                toast.success(data.message)
                getDoctorsData()
                navigate('/appointments')
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error);
            
            toast.error(data.message)
        }
    }


    return docInfo && (
        <div className="p-4 sm:p-8">
            {/* --------------- Doctor Details --------------- */}
            <div className="flex flex-col sm:flex-row gap-6 bg-white shadow-lg rounded-lg p-6">
                <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt={docInfo.name} />
                
                <div className="flex-1">
                    <p className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                        {docInfo.name}
                        <img className="w-5" src={assets.verified_icon} alt="Verified" />
                    </p>
                    <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
                    </div>

                    {/* Doctor About Section */}
                    <div className="mt-4">
                        <p className="flex items-center gap-1 text-sm font-medium text-gray-900">
                            About
                            <img src={assets.info_icon} alt="Info" />
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{docInfo.about}</p>
                    </div>
                    
                    <p className="text-gray-500 font-medium mt-4">
                        Appointment Fee: <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span>
                    </p>
                </div>
            </div>

            {/* --------------- Booking Slots --------------- */}
            <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
                <p className="text-lg font-semibold text-gray-700">Booking Slots</p>

                {docSlots.length === 0 ? (
                    <p className="text-gray-500 mt-4">No slot available</p>
                ) : (
                    <>
                        {/* Date Slots */}
                        <div className="flex gap-3 items-center w-full overflow-x-auto mt-4">
                            {docSlots.map((slots, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => setSlotIndex(index)} 
                                    className={`text-center py-4 px-3 min-w-16 rounded-full cursor-pointer 
                                        ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-300'}`}
                                >
                                    <p>{daysOfWeek[slots[0].datetime.getDay()]}</p>
                                    <p>{slots[0].datetime.getDate()}</p>
                                </div>
                            ))}
                        </div>

                        {/* Time Slots */}
                        {docSlots[slotIndex]?.length > 0 ? (
                            <div className="flex gap-3 w-full overflow-x-auto mt-4">
                                {docSlots[slotIndex].map((slot, index) => (
                                    <p 
                                        key={index} 
                                        onClick={() => setSlotTime(slot.time)} 
                                        className={`text-sm px-5 py-2 rounded-lg cursor-pointer 
                                            ${slot.time === slotTime ? 'bg-primary text-white' : 'border border-gray-300'}`}
                                    >
                                        {slot.time.toLowerCase()}
                                    </p>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 mt-4">No slots available for this day</p>
                        )}
                    </>
                )}

                <button onClick={bookAppointment} className="bg-primary text-white text-sm px-6 py-3 rounded-lg mt-6">
                    Book An Appointment
                </button>
            </div>

            {/* --------------- Related Doctors --------------- */}
            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
    );
};

export default Appointment;
