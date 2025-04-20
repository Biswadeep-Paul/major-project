import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";

const Banner = () => {
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);

    // Check if userData is present
    const isLoggedIn = userData && Object.keys(userData).length > 0;

    return (
        <div className="flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 shadow-lg">
            {/* Left side */}
            <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white">
                    <motion.p
                        className="text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
                            100+ Trusted Customers
                        </span>
                        <br />
                        Book an Appointment Now!
                    </motion.p>
                </div>

                {!isLoggedIn && (
                    <motion.button
                        onClick={() => {
                            navigate('/login');
                            scrollTo(0, 0);
                        }}
                        className="group flex items-center m-3 gap-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-md hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Create Account
                        <motion.img
                            className="w-4 transition-transform group-hover:translate-x-1"
                            src={assets.arrow_icon}
                            animate={{
                                x: [0, 5, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                            alt="arrow"
                        />
                    </motion.button>
                )}

            </div>

            {/* Right side */}
            <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
                <img
                    className="w-full absolute bottom-0 right-0 max-w-md drop-shadow-xl"
                    src={assets.appointment_img}
                    alt=""
                />
            </div>
        </div>
    );
};

export default Banner;
