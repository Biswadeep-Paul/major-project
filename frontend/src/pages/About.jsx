import React from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion"; // For animations

const About = () => {
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
          ABOUT <span className="text-primary">US</span>
        </p>
      </motion.div>

      {/* About Section */}
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
          src={assets.about_image}
          alt="About Us"
        />
        <motion.div
          variants={fadeInUp}
          className="flex flex-col justify-center gap-6 text-gray-600 text-lg md:w-3/5"
        >
          <p>
            We are dedicated to providing top-tier services with a focus on
            innovation, convenience, and customer satisfaction. Our goal is to
            make your experience seamless and enjoyable.
          </p>
          <p>
            With a team of experts and a passion for excellence, we strive to
            exceed expectations in every aspect of our work.
          </p>
          <h3 className="text-gray-800 text-2xl font-semibold">Our Vision</h3>
          <p>
            Our vision is to revolutionize the industry by offering efficient and
            personalized solutions that cater to every individual's needs.
          </p>
        </motion.div>
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true }}
        className="text-center text-3xl font-bold text-gray-800 my-16"
      >
        <p>
          WHY <span className="text-primary">CHOOSE US?</span>
        </p>
      </motion.div>

      {/* Cards Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          {
            title: "Efficiency",
            description:
              "We deliver fast and reliable solutions with minimal hassle.",
          },
          {
            title: "Convenience",
            description:
              "Our services are designed for your ease and comfort.",
          },
          {
            title: "Personalization",
            description:
              "We tailor our solutions to match your unique needs.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            className="border px-8 py-10 flex flex-col gap-4 text-center bg-white rounded-xl shadow-lg hover:shadow-xl hover:bg-gradient-to-r from-green-500 to-blue-500 hover:text-white transition-all duration-300 cursor-pointer"
          >
            <h3 className="text-2xl font-semibold">{item.title}</h3>
            <p className="text-gray-600 hover:text-white">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default About;