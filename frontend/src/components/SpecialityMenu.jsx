import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { specialityData } from '../assets/assets';

const SpecialityMenu = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="relative py-20 overflow-hidden bg-" id="speciality">
      {/* Floating animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-100 opacity-20"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 100],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your <span className="text-transparent bg-clip-text bg-primary">Medical Specialist</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Connect with world-class doctors across 50+ specialties for personalized healthcare
          </p>
        </motion.div>

        {/* Interactive Specialty Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 relative">
          {specialityData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true, margin: "-50px" }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative h-full"
            >
              <Link
                to={`/doctors/${item.speciality}`}
                onClick={() => window.scrollTo(0, 0)}
                className="block h-full"
              >
                <motion.div
                  className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-2xl"
                  whileHover={{ y: -10 }}
                >
                  <div className="relative pt-[100%] bg-gradient-to-br from-blue-50 to-white">
                    <motion.img
                      src={item.image}
                      alt={item.speciality}
                      className="absolute top-0 left-0 w-full h-full object-contain p-6"
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: hoveredCard === index ? 1.1 : 1 
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="p-4 text-center flex-grow flex flex-col justify-center">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.speciality}</h3>
                    <p className="text-xs text-gray-500">50+ specialists</p>
                  </div>
                </motion.div>
              </Link>

              {/* Glow effect on hover */}
              <AnimatePresence>
                {hoveredCard === index && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-blue-500 opacity-10 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Animated CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          
        </motion.div>
      </div>

      {/* Floating doctor illustration at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 0.1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none"
      >
        <img 
          src="/images/doctor-outline.svg" 
          alt=""
          className="w-64 opacity-10"
        />
      </motion.div>
    </section>
  );
};

export default SpecialityMenu;