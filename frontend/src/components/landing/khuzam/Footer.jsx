import React, { useState } from "react";
import { Button, Typography } from "@material-tailwind/react"; 
import { subscribeToNewsletter } from "../../../services/newsletterService"; 
import gatewayImage from "./images/Gateway.jpg"; 

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await subscribeToNewsletter({ email }); // Call the API service
      console.log("Subscribed successfully:", email);
      alert("Thank you for subscribing!");
      setEmail("");
    } catch (error) {
      console.error("Error subscribing to newsletter:", error.response?.data || error.message);
      alert("Failed to subscribe. Please try again.");
    }
  };

  const navigationLinks = [
    "Ajdan's Story",
    "Residential",
    "Commercial",
    "Contact Us",
  ]; // Updated to 4 links

  return (
    <>
      {/* Pre-Footer Section */}
      <div
        className="relative bg-gray-800 text-white flex items-center justify-center"
        style={{
          height: "200px",
          backgroundImage: `url(${gatewayImage})`, // Set background image
          backgroundSize: "cover", // Ensure the image covers the entire section
          backgroundPosition: "center", // Center the image
        }}
      >
        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <section className="relative py-20 mx-auto container max-w-lg px-8">
          <div className="grid gap-4 text-center">
            {/* Text */}
            <Typography className="text-white !font-semibold">
              Stay in the Know: Subscribe for Exclusive Updates
            </Typography>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex items-start flex-col gap-4 md:flex-row"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white placeholder:text-slate-400 text-black text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease-in-out outline-none focus:outline-none focus:ring-0 focus:border-slate-200 focus:shadow-none hover:border-slate-300 shadow-sm caret-black" // Added caret-black for black cursor and text-black for black text
              />
              <Button
                type="submit"
                className="flex-shrink-0 md:w-fit w-full"
                style={{ backgroundColor: "#717b65" }} 
              >
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </div>

      {/* Footer Section */}
      <footer
        className="flex flex-col pt-10 text-stone-200 text-sm"
        style={{ backgroundColor: "#14202e" }}
      >
        <div className="flex items-center justify-between px-6 w-full max-md:px-4">
          {/* Left: Logo */}
          <div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/bc76ab510b473c2fd62f1ab0acc9a3488adee8ba?placeholderIfAbsent=true&apiKey=15fc2f5d6dad43d5af0854bebe07a404"
              alt="Ajdan Logo"
              className="object-contain mb-4"
              style={{ width: "100px", height: "" }}
            />
          </div>

          {/* Right: Navigation Links */}
          <nav className="text-sm">
            <ul className="text-xl space-y-1">
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Copyright */}
        <section
          className="flex flex-wrap justify-center gap-4 items-center mt-6 px-4 text-xs"
          style={{ marginBottom: "20px" }}
        >
          <p>© {new Date().getFullYear()} Ajdan. All rights reserved.</p>
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:underline">
            Terms and Conditions
          </a>
        </section>
      </footer>

      {/* Sticky Buttons */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          className="bg-blue-600 text-white px-4 py-2 rounded-[30px] shadow-md flex items-center gap-2"
          onClick={() => alert("Call to Action Clicked!")}
        >
          Call to Action
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="https://wa.me/1234567890" // Replace with your WhatsApp number
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-3 rounded-full shadow-md flex items-center justify-center"
        >
          <i className="fa-brands fa-whatsapp"></i> {/* WhatsApp icon */}
        </a>
      </div>
    </>
  );
}

export default Footer;
