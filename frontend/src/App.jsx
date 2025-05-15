import { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
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
import logo2 from "./assets/athercare_3_logo_imresizer-removebg-preview.png"; // Adjust path if needed
import MedicalChatbot from "./components/MedicalChatbot";
import { ToastContainer } from "react-toastify";
import PrescriptionPage from "./components/PrescriptionPage";
import HealthCard from "./components/HealthCard";
import HealthCardGenerator from "./components/HealthCardGenerator";
import ForgotPasswordUser from "./pages/ForgotPassword";
import ResetPasswordUser from "./pages/ResetPassword";

const App = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Tracks the current route

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

  // Conditional rendering for Navbar and Footer
  const excludeNavbarFooter = location.pathname === "/healthcardprint";

  return (
    <div>
      <div className="mx-4 sm:mx-[10%]">
        <ToastContainer />
        {!excludeNavbarFooter && <Navbar />} {/* Show Navbar if route isn't excluded */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/my-appointments" element={<MyAppointment />} />
          <Route path="/healthcard" element={<HealthCard />} />
          <Route path="/appointment/:docId" element={<Appointment />} />
          <Route path="/pres" element={<PrescriptionPage />} />
          <Route path="/forgot-password-user" element={<ForgotPasswordUser />} />
          <Route path="/reset-password-user" element={<ResetPasswordUser/>} />
        </Routes>
        {!excludeNavbarFooter && <Footer /> } {/*Show Footer if route isn't excluded*/}
        {!excludeNavbarFooter && <MedicalChatbot /> } {/*Show medical chatbot  if route isn't excluded*/}

        {/* <div>
          
        </div> */}
      </div>
      <div className="flex items-center justify-center">
        <Routes>
          <Route path="/healthcardprint" element={<HealthCardGenerator />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;