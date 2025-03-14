import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTimesCircle, FaCalendarCheck, FaSpinner } from "react-icons/fa"; // Import icons
import { motion } from "framer-motion"; // For animations

const MyAppointment = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserAppointment = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment/",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        getUserAppointment();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointment();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b text-2xl flex items-center gap-2">
        <FaCalendarCheck className="text-primary" /> My Appointments
      </p>
      {appointments.length === 0 ? (
        <div className="text-center mt-8 text-zinc-500">
          <p>You have no appointments scheduled.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {appointments.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-6 rounded-lg shadow-md ${
                item.cancelled ? "bg-gray-50 opacity-75" : "bg-white"
              } hover:shadow-lg transition-shadow duration-300`}
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
                <div className="flex justify-center md:justify-start">
                  <img
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                    src={item.docData.image}
                    alt="Doctor"
                  />
                </div>
                <div className="flex-1 text-sm text-zinc-600">
                  <p className="text-neutral-800 font-semibold text-lg">{item.docData.name}</p>
                  <p className="text-primary">{item.docData.speciality}</p>
                  <p className="text-zinc-700 font-medium mt-2">Address:</p>
                  <p className="text-xs">{item.docData.address.line1}</p>
                  <p className="text-xs">{item.docData.address.line2}</p>
                  <p className="text-sm mt-2">
                    <span className="text-neutral-700 font-medium">Date & Time:</span> {item.slotDate} | {item.slotTime}
                  </p>
                </div>
                <div className="flex flex-col gap-2 justify-end">
                  {!item.cancelled && (
                    <button className="text-sm text-white bg-gradient-to-r from-blue-500 to-green-500  hover:bg-primary-dark transition-all duration-300 py-2 px-4 rounded-lg shadow-md">
                      Pay Online
                    </button>
                  )}
                  {!item.cancelled && (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="text-sm text-white bg-red-600 hover:bg-red-700 transition-all duration-300 py-2 px-4 rounded-lg shadow-md"
                    >
                      Cancel Appointment
                    </button>
                  )}
                  {item.cancelled && (
                    <div className="flex items-center justify-center gap-2 py-2 text-sm text-red-600 bg-red-50 rounded-lg">
                      <FaTimesCircle className="text-red-600" />
                      Appointment Cancelled
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointment;