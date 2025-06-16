import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import { subscribeToNewsletter } from "../../../services/newsletterService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import ajdanlogo from '../../../assets/image/ajdan-light-logo.png';
import bayfrontlight from "../../../assets/landing images/BayfrontLight.png";

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await subscribeToNewsletter({ email });
      console.log("Subscribed successfully:", email);
      alert("Thank you for subscribing!");
      setEmail("");
    } catch (error) {
      console.error("Error subscribing to newsletter:", error.response?.data || error.message);
      alert("Failed to subscribe. Please try again.");
    }
  };

  return (
    <footer className="bg-[#073746] text-white px-4 py-10 sm:px-6 lg:px-8">
      {/* Footer Top - Email Subscription */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 w-full">
          <p className="text-base sm:text-lg whitespace-nowrap text-center md:text-left mb-4 md:mb-0">
            Embrace What's About to Arrive
          </p>
          <form onSubmit={handleSubmit} className="w-full md:w-auto min-w-[280px] max-w-md">
            <div className="flex border border-gray-400 rounded overflow-hidden w-full">
              <input
                type="email"
                placeholder="Your Email here"
                className="flex-grow px-4 py-2 text-white bg-transparent outline-none placeholder-gray-300 text-sm sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit"
                className="bg-white text-[#073746] font-bold px-4 sm:px-6 py-2 rounded-none text-sm sm:text-base whitespace-nowrap"
              >
                Send Now
              </Button>
            </div>
          </form>
        </div>

        {/* Footer Middle - Logo and Social */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div className="logo-section flex flex-col items-center md:items-start">
            <div>
              <a href="/" className="flex items-center space-x-2 sm:space-x-4">
                {/* Bayfront Logo */}
                <img
                  src={bayfrontlight}
                  alt="Bayfront Logo"
                  className="h-10 sm:h-12 w-24 sm:w-32 object-contain"
                />

                {/* Divider */}
                <div className="h-6 sm:h-8 w-px bg-white opacity-50" />

                {/* Ajdan Logo */}
                <img
                  src={ajdanlogo}
                  alt="Ajdan Logo"
                  className="h-6 sm:h-8 w-16 sm:w-20 object-contain"
                />
              </a>
            </div>

            <div className="social-icons flex gap-4 mt-4">
              <a href="#" className="text-white hover:text-gray-300 transition-colors">
                <FontAwesomeIcon icon={faFacebookF} size="sm" className="w-4 h-4" />
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">
                <FontAwesomeIcon icon={faInstagram} size="sm" className="w-4 h-4" />
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">
                <FontAwesomeIcon icon={faTwitter} size="sm" className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex justify-center gap-4 sm:gap-6 md:gap-8 flex-wrap mb-8 text-xs sm:text-sm">
          <a href="#" className="text-white hover:text-gray-300 transition-colors whitespace-nowrap">About</a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors whitespace-nowrap">Privacy Policy</a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors whitespace-nowrap">Terms & Conditions</a>
        </div>

        {/* Footer Bottom - Copyright */}
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center mt-8 text-xs">
          <div className="order-2 md:order-1 mt-4 md:mt-0"></div>
          <div className="order-1 md:order-2 text-center md:text-right">
            @ Copyright Ajdan | All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;