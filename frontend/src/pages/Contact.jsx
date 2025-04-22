import React from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion"; // For animations

const Contact = () => {
  // Animation variants for Framer Motion
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Title Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true }}
        className="text-center text-4xl font-bold text-gray-800 mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact<span className="text-transparent bg-clip-text bg-primary"> Us</span>
          </h2>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row items-center gap-12 bg-white p-8 rounded-xl shadow-lg border border-gray-100"
      >
        <motion.img
          variants={fadeInUp}
          className="w-full md:max-w-[400px] rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
          src={assets.contact_image}
          alt="Contact Us"
        />
        <motion.div
          variants={fadeInUp}
          className="flex flex-col justify-center gap-6 text-gray-600 text-lg"
        >
          <h3 className="text-gray-800 text-2xl font-semibold">Our Office</h3>
          <p className="text-gray-700">
            <strong>Address:</strong> 123 Main Street, City, Country
          </p>
          <p className="text-gray-700">
            <strong>Phone:</strong> +123 456 7890
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> contact@atherCare.com
          </p>
          <h3 className="text-gray-800 text-2xl font-semibold">
            At Ather Care
          </h3>
          <p className="text-gray-700">
            Your well-being is our top priority. Whether you have a question, need support, or just want to say hello — we're here to listen. Reach out and we'll get back to you as soon as possible. Your journey to better health starts with a simple message
          </p>

          {/* Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white text-center px-6 py-3 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer-none"
          >
          Caring for You, Like Family.
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;