import  { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [token, setToken] = useState(true);

    return (
        <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
            {/* Logo */}
            <img onClick={() => navigate('/')} className="w-44 cursor-pointer" src={assets.logo} alt="Logo" />

            {/* Desktop Menu */}
            <ul className="hidden md:flex items-start gap-5 font-medium">
                <NavLink to="/" className="py-1">
                    HOME
                </NavLink>
                <NavLink to="/doctors" className="py-1">
                    ALL DOCTORS
                </NavLink>
                <NavLink to="/about" className="py-1">
                    ABOUT
                </NavLink>
                <NavLink to="/contact" className="py-1">
                    CONTACT
                </NavLink>
                <NavLink to="http://localhost:5175/" className="py-1">
                    AI
                </NavLink>
            </ul>

            {/* Right-Side Icons */}
            <div className="flex items-center gap-4">
                {token ? (
                    <div className="flex items-center gap-2 cursor-pointer group relative">
                        <img className="w-8 rounded-full" src={assets.profile_pic} alt="Profile" />
                        <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown" />
                        {/* Dropdown Menu */}
                        <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                            <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                                <p onClick={() => navigate('/my-profile')} className="hover:text-black cursor-pointer">My Profile</p>
                                <p onClick={() => navigate('/my-appointments')} className="hover:text-black cursor-pointer">My Appointment</p>
                                <p onClick={() => setToken(false)} className="hover:text-black cursor-pointer">Logout</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')} className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block">
                        Create Account
                    </button>
                )}

                {/* Mobile Menu Icon */}
                <img onClick={() => setShowMenu(true)} className="w-6 md:hidden cursor-pointer" src={assets.menu_icon} alt="Menu" />
            </div>

            {/* --------------------- Mobile Menu -------------------- */}
            <div className={`fixed top-0 right-0 bottom-0 z-20 bg-white transition-all duration-300 ${showMenu ? 'w-3/4 h-full p-4' : 'w-0 overflow-hidden'}`}>
                <div className="flex justify-between items-center p-4 border-b">
                    <img src={assets.logo} alt="Logo" className="w-32" />
                    <img onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Close" className="w-6 cursor-pointer" />
                </div>

                {/* Mobile Menu Links */}
                <ul className="flex flex-col gap-4 mt-5 text-lg font-medium">
                    <NavLink to="/" onClick={() => setShowMenu(false)} className="hover:text-primary">
                        Home
                    </NavLink>
                    <NavLink to="/doctors" onClick={() => setShowMenu(false)} className="hover:text-primary">
                        All Doctors
                    </NavLink>
                    <NavLink to="/about" onClick={() => setShowMenu(false)} className="hover:text-primary">
                        About
                    </NavLink>
                    <NavLink to="/contact" onClick={() => setShowMenu(false)} className="hover:text-primary">
                        Contact
                    </NavLink>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
