import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion"; // For animations

const Navbar = () => {
    const navigate = useNavigate();
    const { token, setToken, userData } = useContext(AppContext);
    const [showMenu, setShowMenu] = useState(false);

    const logout = () => {
        setToken(false);
        localStorage.removeItem("token");
    };

    // Animation variants for Framer Motion
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
    };

    const slideIn = {
        hidden: { x: "100%" },
        visible: { x: 0, transition: { duration: 0.3 } },
    };

    return (
        <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-200">
            {/* Logo */}
            <motion.img
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => navigate("/")}
                className="w-20 cursor-pointer"
                src={assets.logo2}
                alt="Logo"
            />

            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center gap-8 font-medium">
                {[
                    { path: "/", label: "HOME" },
                    { path: "/doctors", label: "ALL DOCTORS" },
                    { path: "/about", label: "ABOUT" },
                    { path: "/contact", label: "CONTACT" },

                    { path: "http://localhost:5175/", label: "AI" }

                ].map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path}
                        className={({ isActive }) =>
                            `relative py-1 px-2 font-semibold transition-all duration-300 
                            ${isActive
                                ? "text-transparent bg-clip-text bg-primary after:content-[''] after:w-full after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-green-500"
                                : "text-gray-500 hover:text-blue-400"}`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </ul>

            {/* Right-Side Icons */}
            <div className="flex items-center gap-4">
                {token && userData ? (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 cursor-pointer group relative"
                    >
                        <img
                            className="w-8 h-8 rounded-full object-cover"
                            src={userData.image}
                            alt="Profile"
                        />
                        <img
                            className="w-2.5"
                            src={assets.dropdown_icon}
                            alt="Dropdown"
                        />
                        {/* Dropdown Menu */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="absolute top-0 right-0 left-0 pt-10 text-base font-medium text-gray-600 z-20 hidden group-hover:block"
                        >
                            <div className="min-w-48 bg-white rounded-lg shadow-lg flex flex-col p-4">
                                <p
                                    onClick={() => navigate("/my-profile")}
                                    className="hover:text-black hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
                                >
                                    My Profile
                                </p>
                                <p
                                    onClick={() => navigate("/my-appointments")}
                                    className="hover:text-black hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
                                >
                                    My Appointments
                                </p>
                                <p
                                    onClick={() => navigate("/pres")}
                                    className="hover:text-black hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
                                >
                                    Prescription
                                </p>
                                <p
                                    onClick={() => navigate("/healthcard")}
                                    className="hover:text-black hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
                                >
                                    Get Health Card
                                </p>
                                <p
                                    onClick={logout}
                                    className="hover:text-black hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
                                >
                                    Logout
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/login")}
                        className="bg-primary text-white px-8 py-3 rounded-full font-semibold hidden md:block"
                    >
                        Create Account
                    </motion.button>
                )}

                {/* Mobile Menu Icon */}
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowMenu(true)}
                    className="w-6 md:hidden cursor-pointer"
                    src={assets.menu_icon}
                    alt="Menu"
                />
            </div>

            {/* --------------------- Mobile Menu -------------------- */}
            <AnimatePresence>
                {showMenu && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={slideIn}
                        className="fixed top-0 right-0 bottom-0 z-20 bg-white w-3/4 h-full p-4 shadow-lg"
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <img
                                src={assets.logo2}
                                alt="Logo"
                                className="w-32"
                            />
                            <motion.img
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowMenu(false)}
                                src={assets.cross_icon}
                                alt="Close"
                                className="w-6 cursor-pointer"
                            />
                        </div>

                        {/* Mobile Menu Links */}
                        <ul className="flex flex-col gap-4 mt-5 text-lg font-medium">
                            {[
                                { path: "/", label: "Home" },
                                { path: "/doctors", label: "All Doctors" },
                                { path: "/about", label: "About" },
                                { path: "/contact", label: "Contact" },
                            ].map((link, index) => (
                                <NavLink
                                    key={index}
                                    to={link.path}
                                    onClick={() => setShowMenu(false)}
                                    className="hover:text-blue-500"
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar;