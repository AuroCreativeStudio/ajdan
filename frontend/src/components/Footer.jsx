// src/components/Footer.js
// import LanguageToggle from './LanguageToggle';

// const Footer = () => (
//   <footer style={{ backgroundColor: '#333', color: '#fff', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  
//     <LanguageToggle />

 
//     <div>© {new Date().getFullYear()} Your Company. All rights reserved.</div>
//   </footer>
// );

// export default Footer;

"use client";

import React, { useState } from "react";

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  const navigationLinks = [
    "Ajdan's Story",
    "Residential",
    "Commercial",
    "Residential & Commercial",
    "Contact Us"
  ];

  const partners = Array(5).fill(null);

  return (
    <footer className="flex flex-col pt-10 bg-slate-900 text-stone-200 text-sm">
      <div className="flex flex-col items-end px-6 w-full  max-md:px-4">
        <div className="flex flex-wrap gap-5 justify-between self-stretch">
          {/* Navigation */}
          <nav className="text-sm">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/bc76ab510b473c2fd62f1ab0acc9a3488adee8ba?placeholderIfAbsent=true&apiKey=15fc2f5d6dad43d5af0854bebe07a404"
              alt="Ajdan Logo"
              className="object-contain w-42 mb-4"
            />
            <ul className=" text-xl space-y-1">
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Partners */}
          <section className="flex flex-col items-start mt-4">
            <h2 className="text-xl mb-2">Our Partners</h2>
            <div className="flex mr-44 flex-wrap gap-3">
              {partners.map((_, index) => (
                <div
                  key={index}
                  className="bg-black mr-2 h-10 w-10"
                  aria-label={`Partner logo ${index + 1}`}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Newsletter */}
        <section className="mt-6 mr-24 w-full max-w-md">
          <h3 className="text-base mb-2">Subscribe to our newsletter</h3>
          <form
            onSubmit={handleSubmit}
            className="flex text-sm"
          >
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-1 text-black bg-white"
              required
            />
            <button
              type="submit"
              className="px-4 py-1 border border-stone-200 text-stone-200 hover:bg-stone-200 hover:text-slate-900 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </section>
      </div>

      {/* Copyright */}
      <section className="flex flex-wrap justify-center gap-4 items-center mt-6 px-4 text-xs">
        <p>© {new Date().getFullYear()} Ajdan. All rights reserved.</p>
        <a href="/privacy" className="hover:underline">Privacy Policy</a>
        <a href="/terms" className="hover:underline">Terms and Conditions</a>
      </section>

      {/* Discover Marquee */}
      <div className="mt-6 w-full bg-black overflow-hidden">
        <div className="whitespace-nowrap animate-marquee text-4xl text-slate-700 font-bold py-2">
          <span className="inline-block px-4">Discover new horizon</span>
         
        </div>
      </div>
    </footer>
  );
}

export default Footer;
