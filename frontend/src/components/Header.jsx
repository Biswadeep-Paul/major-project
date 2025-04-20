import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Header = () => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: false
    });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        } else {
            controls.start("hidden");
        }
    }, [controls, inView]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        }
    };

    const imageVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 1,
                ease: "anticipate"
            }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
            transition: {
                yoyo: Infinity,
                duration: 0.3
            }
        },
        tap: {
            scale: 0.95
        }
    };

    return (
        <div
            ref={ref}
            className="relative overflow-hidden bg-primary rounded-3xl mx-4 md:mx-10 lg:mx-20 my-10 shadow-2xl"
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white opacity-10"
                        style={{
                            width: Math.random() * 100 + 50,
                            height: Math.random() * 100 + 50,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                        animate={{
                            y: [0, (Math.random() - 0.5) * 100],
                            x: [0, (Math.random() - 0.5) * 50],
                            opacity: [0.05, 0.1, 0.05],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            <div className="relative flex flex-col md:flex-row items-center z-10 px-6 md:px-12 lg:px-24 py-12 md:py-0">
                {/* Left side content */}
                <motion.div
                    className="md:w-1/2 flex flex-col items-start justify-center gap-6 py-10 md:py-16"
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                >
                    <motion.p
                        className="text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight"
                        variants={itemVariants}
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
                            Premium Healthcare
                        </span><br />
                        At Your Fingertips
                    </motion.p>

                    <motion.p
                        className="text-lg text-white/80 font-light max-w-md"
                        variants={itemVariants}
                    >
                        Connect instantly with board-certified doctors for virtual consultations, prescriptions, and medical advice - all from the comfort of your home.
                    </motion.p>

                    <motion.div
                        className="flex items-center gap-4"
                        variants={itemVariants}
                    >
                        <div className="flex -space-x-3">
                            <motion.img
                                src={assets.group_profiles}
                                className="w-28 h-auto" // Adjusted to match your original size
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                alt="Group of patients"
                            />
                        </div>
                        <div className="text-white">
                            <p className="font-medium">5000+ Happy Patients</p>
                            <p className="text-sm opacity-80">Trusted by families nationwide</p>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <motion.a
                            href="#speciality"
                            className="flex items-center gap-3 bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 rounded-full font-bold text-white text-lg shadow-lg"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            Book Instant Consultation
                            <motion.img
                                className="w-4"
                                src={assets.arrow_icon}
                                animate={{
                                    x: [0, 5, 0],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatType: "loop"
                                }}
                                alt=""
                            />
                        </motion.a>
                    </motion.div>
                </motion.div>

                {/* Right side image */}
                <motion.div
                    className="md:w-1/2 relative mt-10 md:mt-0"
                    variants={imageVariants}
                >
                    <img
                        className="w-full max-w-xl mx-auto md:absolute md:-bottom-10 lg:-bottom-20 xl:-bottom-32 transform hover:scale-105 transition-transform duration-500"
                        src={assets.header_img}
                        alt="Doctor smiling"
                    />

                    {/* Floating badges */}
                    <motion.div
                        className="absolute -bottom-5 left-10 bg-white rounded-2xl p-4 shadow-xl"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="bg-green-100 p-2 rounded-full">
                                <img className="w-6" src={assets.verified_icon} alt="Verified" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">24/7 Available</p>
                                <p className="text-xs text-gray-500">Instant connection</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="absolute top-20 -right-5 bg-white rounded-2xl p-4 shadow-xl"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1, duration: 0.6 }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <img className="w-6" src={assets.chats_icon} alt="Rated" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">4.9/5 Rating</p>
                                <p className="text-xs text-gray-500">500+ reviews</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Floating animated elements */}
            <motion.div
                className="absolute bottom-10 left-1/4 w-16 h-16 bg-pink-400 rounded-full filter blur-3xl opacity-20"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 30, 0]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute top-20 right-1/3 w-24 h-24 bg-cyan-400 rounded-full filter blur-3xl opacity-20"
                animate={{
                    scale: [1, 1.3, 1],
                    y: [0, -40, 0]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
            />
        </div>
    );
};

export default Header;