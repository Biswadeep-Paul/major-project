import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState('');
  const [ratings, setRatings] = useState({});
  const [showRelatedDoctors, setShowRelatedDoctors] = useState({}); // Track which appointments should show related doctors

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  };

  const DayDate = (slotDate) => {
    const day = slotDate.split('_')[0];
    return day;
  };

  const MonthDate = (slotDate) => {
    const month = slotDate.split('_')[1];
    return months[month];
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } });
      setAppointments(data.appointments.reverse());
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const appointment = appointments.find(item => item._id === appointmentId);
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } });
      if (data.success) {
        if (appointment.isCompleted) {
          toast.error("Cannot cancel a completed appointment");
          return;
        }
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleRating = async (docId, rating) => {
    console.log(docId);
    console.log(rating);

    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/rate`, { docId, rating }, {
        headers: { token }
      });

      if (data.success) {
        toast.success("Rating submitted successfully!");
        setRatings((prevRatings) => {
          const updatedRatings = { ...prevRatings, [docId]: rating };
          localStorage.setItem('ratings', JSON.stringify(updatedRatings));
          return updatedRatings;
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit rating!");
    }
  };

  const toggleRelatedDoctors = (appointmentId) => {
    setShowRelatedDoctors(prev => ({
      ...prev,
      [appointmentId]: !prev[appointmentId]
    }));
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }

    const storedRatings = JSON.parse(localStorage.getItem('ratings'));
    if (storedRatings) {
      setRatings(storedRatings);
    }
  }, [token]);

  return (
    <div>
      <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>My appointments</p>
      <div className=''>
        {appointments.map((item, index) => (
          <div key={index} className="mb-6">
            {/* Main Appointment Card */}
            <div className='grid grid-cols-[1fr_1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b bg-gray-50 m-5 p-5 rounded-lg'>
              <div className='flex flex-col justify-center items-center text-2xl px-10 border-r-4 border-dotted border-red-500 font-bold rounded-full '>
                <span className='text-5xl'>{DayDate(item.slotDate)}</span>
                <span>{MonthDate(item.slotDate)}</span>
              </div>
              <div>
                <img className='w-36 bg-[#EAEFFF]' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-[#5E5E5E]' >
                <p className='text-[#262626] text-base font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-[#464646] font-medium mt-1'>Address:</p>
                <p>{item.docData.address.line1}</p>
                <p>{item.docData.address.line2}</p>
                <p className=' mt-1'><span className='text-sm text-[#3C3C3C] font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
              </div>
              <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                {item.isCompleted && (
                  <div className="flex flex-col items-center gap-2 border-2 border-green-500 p-2 px-14 rounded-md">
                    <p className="text-green-500 font-medium">Completed</p>
                  </div>
                )}
                {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                  <button onClick={() => setPayment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border-2 rounded hover:bg-primary hover:text-white transition-all duration-300'>
                    Pay Online
                  </button>
                )}
                {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                  <>
                    <button onClick={() => appointmentStripe(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'>
                      <img className='max-w-20 max-h-5' src={assets.stripe_logo} alt="" />
                    </button>
                    <button onClick={() => appointmentRazorpay(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'>
                      <img className='max-w-20 max-h-5' src={assets.razorpay_logo} alt="" />
                    </button>
                  </>
                )}
                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border rounded text-[#696969] bg-[#EAEFFF]'>Paid</button>
                )}
                {!item.cancelled && !item.isCompleted && (
                  <button onClick={() => cancelAppointment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border-2 rounded hover:bg-red-600 hover:text-white transition-all duration-300'>
                    Cancel appointment
                  </button>
                )}
                {item.cancelled && !item.isCompleted && (
                  <div className="flex flex-col gap-2">
                    <button className='sm:min-w-48 py-2 border-2 border-red-500 rounded text-red-500'>
                      Appointment cancelled
                    </button>
                    <button
                      onClick={() => toggleRelatedDoctors(item._id)}
                      className='sm:min-w-48 py-2 rounded text-purple-500 border-2 border-purple-500 hover:bg-blue-50 transition-all duration-300'
                    >
                      <span className='animate-bounce inline-block pt-2'>
                        {showRelatedDoctors[item._id] ? 'Hide Similar Doctors' : 'Find Similar Doctors'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RelatedDoctors Component - Shown when dropdown is clicked */}
            {item.cancelled && !item.isCompleted && showRelatedDoctors[item._id] && (
              <div className="mx-5 mt-[-1rem] mb-8 p-4 bg-white shadow-md border-l-4 border-blue-500 rounded-md transition-all duration-300 hover:shadow-lg">
                <RelatedDoctors docId={item.docData._id} speciality={item.docData.speciality} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;