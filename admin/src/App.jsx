import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // ✅ Toastify styles

import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import logo2 from "/logo2.png"; 

const App = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // Simulated loading delay
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="relative flex items-center justify-center w-32 h-32">
          {/* Spinner */}
          <div
            className="absolute w-full h-full rounded-full animate-spin"
            style={{
              background: `conic-gradient(
                from 0deg,
                transparent 0deg 0deg, /* Gap at the top */
                blue 90deg 180deg,    /* Green gradient */
                purple 180deg 270deg,     /* Blue gradient */
                transparent 300deg 360deg /* Gap at the bottom */
              )`,
              mask: `radial-gradient(
                farthest-side,
                transparent calc(100% - 4px),
                #000 calc(100% - 4px)
              )`, // Creates the border effect
            }}
          ></div>
          {/* Fixed Logo (Fades In & Out) */}
          <img src={logo2} alt="Logo" className="w-20 h-20 animate-pulse" />
        </div>
        <p className="mt-3 text-gray-600 font-medium animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* ✅ Global Toast Container */}
      <ToastContainer/>

      <Routes>
        {/* Public Routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        {dToken || aToken ? (
          <Route
            path="*"
            element={
              <div className="bg-[#F8F9FD]">
                <Navbar />
                <div className="flex items-start">
                  <Sidebar />
                  <Routes>
                    <Route path="/admin-dashboard" element={<Dashboard />} />
                    <Route path="/all-appointments" element={<AllAppointments />} />
                    <Route path="/add-doctor" element={<AddDoctor />} />
                    <Route path="/doctor-list" element={<DoctorsList />} />
                    <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                    <Route path="/doctor-appointments" element={<DoctorAppointments />} />
                    <Route path="/doctor-profile" element={<DoctorProfile />} />
                  </Routes>
                </div>
              </div>
            }
          />
        ) : (
          // If not logged in, redirect to login
          <Route path="*" element={<Login />} />
        )}
      </Routes>
    </>
  );
};

export default App;
