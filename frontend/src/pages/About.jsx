import React from "react";
import { assets } from "../assets/assets";

const About = () => {
    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Title Section */}
            <div className="text-center text-3xl font-semibold text-gray-700 mb-8">
                <p>ABOUT <span className="text-primary">US</span></p>
            </div>

            {/* About Section */}
            <div className="flex flex-col md:flex-row items-center gap-12 bg-gray-50 p-8 rounded-lg shadow-lg">
                <img 
                    className="w-full md:max-w-[400px] rounded-lg shadow-md" 
                    src={assets.about_image} 
                    alt="About Us"
                />
                <div className="flex flex-col justify-center gap-6 text-gray-600 text-lg md:w-3/5">
                    <p>
                        We are dedicated to providing top-tier services with a focus on innovation, 
                        convenience, and customer satisfaction. Our goal is to make your experience 
                        seamless and enjoyable.
                    </p>
                    <p>
                        With a team of experts and a passion for excellence, we strive to exceed expectations 
                        in every aspect of our work.
                    </p>
                    <h3 className="text-gray-800 text-xl font-semibold">Our Vision</h3>
                    <p>
                        Our vision is to revolutionize the industry by offering efficient and 
                        personalized solutions that cater to every individual's needs.
                    </p>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="text-center text-2xl font-semibold text-gray-700 my-12">
                <p>WHY <span className="text-primary">CHOOSE US?</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Efficiency", description: "We deliver fast and reliable solutions with minimal hassle." },
                    { title: "Convenience", description: "Our services are designed for your ease and comfort." },
                    { title: "Personalization", description: "We tailor our solutions to match your unique needs." }
                ].map((item, index) => (
                    <div 
                        key={index} 
                        className="border px-8 py-10 flex flex-col gap-4 text-center 
                        bg-white rounded-lg shadow-md hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
                    >
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        <p className="text-gray-600 hover:text-white">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default About;
