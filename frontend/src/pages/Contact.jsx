import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Title Section */}
            <div className="text-center text-3xl font-semibold text-gray-700 mb-8">
                <p>CONTACT <span className="text-primary">US</span></p>
            </div>

            {/* Contact Section */}
            <div className="flex flex-col md:flex-row items-center gap-12 bg-gray-50 p-8 rounded-lg shadow-lg">
                <img 
                    className="w-full md:max-w-[400px] rounded-lg shadow-md" 
                    src={assets.contact_image} 
                    alt="Contact Us"
                />
                <div className="flex flex-col justify-center gap-6 text-gray-600 text-lg">
                    <h3 className="text-gray-800 text-xl font-semibold">Our Office</h3>
                    <p className="text-gray-700"><strong>Address:</strong> 123 Main Street, City, Country</p>
                    <p className="text-gray-700"><strong>Phone:</strong> +123 456 7890</p>
                    <p className="text-gray-700"><strong>Email:</strong> contact@precripto.com</p>
                    <h3 className="text-gray-800 text-xl font-semibold">Careers at Precripto</h3>
                    <p className="text-gray-700">Join our team and be a part of something amazing!</p>

                    {/* Button */}
                    <button className="bg-primary text-white px-4 py-3 rounded-lg text-lg font-medium shadow-md hover:bg-primary-dark transition-all">
                        Explore Jobs
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Contact;
