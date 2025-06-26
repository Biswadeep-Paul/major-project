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
  const [ratings, setRatings] = useState({});
  const [showRelatedDoctors, setShowRelatedDoctors] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

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

  const initiateCardPayment = (appointment) => {
    setCurrentAppointment(appointment);
    setShowPaymentModal(true);
    setIsPaymentSuccess(false);
    setPaymentDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: ''
    });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsPaymentSuccess(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-payment-status`,
        { appointmentId: currentAppointment._id },
        { headers: { token } }
      );

      if (data.success) {
        setTimeout(() => {
          setShowPaymentModal(false);
          toast.success("Payment successful!");
          setAppointments(prevAppointments => 
            prevAppointments.map(appt => 
              appt._id === currentAppointment._id 
                ? { ...appt, payment: true } 
                : appt
            )
          );
        }, 2000);
      } else {
        toast.error(data.message);
        setIsPaymentSuccess(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment failed!");
      setIsPaymentSuccess(false);
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setPaymentDetails(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    if (name === 'expiryDate') {
      const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
      setPaymentDetails(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRating = async (docId, rating) => {
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
                <p className='text-[#464646] font-medium mt-1'>Fees: ₹{item.docData.fees}</p>
              </div>
              <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                {item.isCompleted && (
                  <div className="flex flex-col items-center gap-2 border-2 border-green-500 p-2 px-14 rounded-md">
                    <p className="text-green-500 font-medium">Completed</p>
                  </div>
                )}
                <p className='font-medium'>By default payment method is cash.</p>
                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button 
                    onClick={() => initiateCardPayment(item)} 
                    className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'
                  >
                    Pay Online
                  </button>
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

            {/* RelatedDoctors Component */}
            {item.cancelled && !item.isCompleted && showRelatedDoctors[item._id] && (
              <div className="mx-5 mt-[-1rem] mb-8 p-4 bg-white shadow-md border-l-4 border-blue-500 rounded-md transition-all duration-300 hover:shadow-lg">
                <RelatedDoctors docId={item.docData._id} speciality={item.docData.speciality} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && currentAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl">
            {/* Modal Header */}
            <div className="bg-[#2B2F72] text-white p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{isPaymentSuccess ? 'Payment Successful!' : 'Complete Payment'}</h2>
                {!isPaymentSuccess && (
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="text-white hover:text-gray-200 text-2xl"
                  >
                    &times;
                  </button>
                )}
              </div>
              <div className="mt-2 flex justify-between items-center">
                <p className="text-blue-100">Amount paid</p>
                <p className="text-2xl font-bold">₹{currentAppointment.docData.fees}</p>
              </div>
            </div>

            {/* Success Message */}
            {isPaymentSuccess ? (
              <div className="p-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg 
                      className="w-16 h-16 text-green-500 animate-checkmark" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
                  <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setIsPaymentSuccess(false);
                    }}
                    className="px-6 py-2 bg-[#2B2F72] text-white rounded-lg hover:bg-[#3A3F8F] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Payment Form */
              <div className="p-6">
                <form onSubmit={handlePaymentSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentDetails.cardNumber}
                        onChange={handlePaymentChange}
                        maxLength="19"
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <div className="absolute right-3 top-3 flex space-x-2">
                        {paymentDetails.cardNumber?.startsWith('4') && (
                          <img src={assets.visa} alt="Visa" className="h-5" />
                        )}
                        {(paymentDetails.cardNumber?.startsWith('5') || paymentDetails.cardNumber?.startsWith('2')) && (
                          <img src={assets.mastercard} alt="Mastercard" className="h-5" />
                        )}
                        {paymentDetails.cardNumber?.startsWith('6') && (
                          <img src={assets.rupay} alt="Rupay" className="h-5 object-cover" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentDetails.expiryDate}
                        onChange={handlePaymentChange}
                        maxLength="5"
                        placeholder="MM/YY"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentDetails.cvv}
                        onChange={handlePaymentChange}
                        maxLength="3"
                        placeholder="123"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      name="nameOnCard"
                      value={paymentDetails.nameOnCard}
                      onChange={handlePaymentChange}
                      placeholder="John Doe"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2B2F72] text-white py-3 px-4 rounded-lg hover:bg-[#3A3F8F] transition-colors font-medium flex items-center justify-center"
                  >
                    <span>Pay ₹{currentAppointment.docData.fees}</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>Secure payment with</p>
                  <div className="flex justify-center items-center mt-2 space-x-4">
                    <img className="h-6" src={assets.visa} alt="Visa" />
                    <img className="h-6" src={assets.rupay} alt="Rupay" />
                    <img className="h-6" src={assets.mastercard} alt="Mastercard" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;