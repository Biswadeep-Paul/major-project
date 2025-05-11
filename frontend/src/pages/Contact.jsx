import React, { useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const Contact = () => {
  // State to track form submission status
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Form submission handler using Web3Forms
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "b9db6a49-0ae4-4e7b-88bc-d327396f17fd");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: json
    }).then((res) => res.json());

    if (res.success) {
      console.log("Success", res);
      // Show success popup
      setShowSuccessPopup(true);
      // Reset form
      event.target.reset();
      // Hide popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    }
  };

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
      {/* Success Popup */}
      {showSuccessPopup && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg"
        >
          <div className="flex items-center space-x-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            <p className="font-medium text-lg">Form submitted successfully!</p>
          </div>
        </motion.div>
      )}
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
        className="flex flex-col md:flex-row items-center gap-12 bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-12"
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
            className="bg-primary text-white text-center px-6 py-3 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Caring for You, Like Family.
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Form Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
        className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
      >
        <motion.form 
          variants={fadeInUp}
          onSubmit={onSubmit}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Send Us a <span className="text-transparent bg-clip-text bg-primary">Message</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Name Input */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col"
            >
              <label className="text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your name"
              />
            </motion.div>
            
            {/* Email Input */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col"
            >
              <label className="text-gray-700 font-medium mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </motion.div>
          </div>
          
          {/* Message Input */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col mb-8"
          >
            <label className="text-gray-700 font-medium mb-2">Your Message</label>
            <textarea
              name="message"
              rows="5"
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              placeholder="Enter your message"
            ></textarea>
          </motion.div>
          
          {/* Submit Button */}
          <motion.button
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-primary text-white w-full md:w-auto px-8 py-3 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg transition-all mx-auto block"
          >
            Submit Message
          </motion.button>
        </motion.form>
      </motion.section>
    </div>
  );
};

export default Contact;