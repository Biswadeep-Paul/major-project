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
        <p>
          CONTACT <span className="text-primary">US</span>
        </p>
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
            Careers at Ather Care
          </h3>
          <p className="text-gray-700">
            Join our team and be a part of something amazing!
          </p>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Explore Jobs
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;