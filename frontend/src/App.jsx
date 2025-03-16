import  { useState, useEffect } from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointment from "./pages/MyAppointment";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import logo from "./assets/logo.svg"; // Adjust path if needed
import MedicalChatbot from './components/MedicalChatbot'
import { ToastContainer, toast } from 'react-toastify';


const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // Simulated loading delay
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="relative flex items-center justify-center w-32 h-32">
          {/* Spinner */}
          <div className="absolute w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          {/* Fixed Logo (Fades In & Out) */}
          <img src={logo} alt="Logo" className="w-20 h-20 animate-pulse" />
        </div>
        <p className="mt-3 text-gray-600 font-medium animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer/>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-appointments" element={<MyAppointment />} />
        
        <Route path="/appointment/:docId" element={<Appointment />} />
      </Routes>
      <Footer />
      <div>
      <MedicalChatbot />
    </div>
    </div>
    
  );
};

export default App;
