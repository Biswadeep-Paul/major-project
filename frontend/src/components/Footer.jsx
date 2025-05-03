import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router";

const Footer = () => {
    return (
        <div className="md:mx-10">
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
                {/* --------left section--------- */}
                <div>
                    <img className="mb-5 w-32" src={assets.logo2} alt="" />
                    <p className="w-full md:w-2/3 text-gray-600 leading-6">We’re here to support your health journey with care, expertise, and guidance every step of the way.

Contact Us: Need help? Reach out anytime!
Follow Us: Stay connected for updates and tips.</p>
                </div>
                {/* --------center section--------- */}
                <div>
                    <p className="text-xl font-medium mb-5">COMPANY</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <Link onClick={()=>scrollTo(0,0)} to="/">Home</Link>
                        <Link onClick={()=>scrollTo(0,0)} to="/about">About</Link>
                        <Link onClick={()=>scrollTo(0,0)} to="/doctors">Doctors</Link>
                        <Link onClick={()=>scrollTo(0,0)} to="/contact">Contact</Link>
                    </ul>
                </div>
                {/* --------right section--------- */}
                <div>
                    <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li>+1 23434-3423</li>
                        <li>athercare@gmail.com</li>
                    </ul>
                </div>
            </div>
            {/* ---------Copyright Text ------- */}
            <div>
                <hr />
                <p className="py-5 text-sm text-center">Copyright 2025@ AtherCare - All Rights Reserved</p>
            </div>
        </div>
    )
}

export default Footer;