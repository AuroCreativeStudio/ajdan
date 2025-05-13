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
    // Handle newsletter subscription logic here
    console.log("Subscribing email:", email);
    // Reset form after submission
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
  const discoverLetters = ["D", "i", "s", "c", "o", "v", "e", "r"];
  const neLetters = ["n", "e"];

  return (
    <footer className="flex h-auto overflow-hidden flex-col pt-16 bg-slate-900">
      <div className="flex flex-col items-end px-20 w-full max-md:px-5 max-md:max-w-full">
        <div className="flex flex-wrap gap-5 justify-between self-stretch max-md:max-w-full">
          {/* Footer Navigation */}
          <nav className="text-xl leading-9 text-stone-200">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/bc76ab510b473c2fd62f1ab0acc9a3488adee8ba?placeholderIfAbsent=true&apiKey=15fc2f5d6dad43d5af0854bebe07a404"
              alt="Ajdan Logo"
              className="object-contain w-full aspect-[2.31]"
            />
            <ul className="mt-20 max-md:mt-10 max-md:mr-2.5">
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Partners Section */}
          <section className="flex flex-col self-start mt-12 max-md:mt-10 max-md:max-w-full">
            <h2 className="self-center text-6xl text-stone-200 max-md:text-4xl">
              Our Partners
            </h2>
            <div className="flex flex-wrap gap-5 justify-between mt-1">
              {partners.map((_, index) => (
                <div
                  key={index}
                  className="flex shrink-0 bg-black h-[84px] w-[84px]"
                  aria-label={`Partner logo ${index + 1}`}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Newsletter Subscription */}
        <section className="mt-8 max-w-full">
          <h3 className="text-3xl text-stone-200 max-md:mr-2.5 max-md:max-w-full">
            SUBSCRIBE TO OUR NEWSLETTER
          </h3>
          <form
            className="flex mt-5 max-w-full text-2xl w-[447px] max-md:mr-2.5"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Your Email here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="grow shrink-0 px-11 py-2.5 text-black bg-white basis-0 w-fit max-md:px-5"
              required
            />
            <button
              type="submit"
              className="px-11 py-2.5 whitespace-nowrap border-2 border-solid border-stone-200 text-stone-200 max-md:px-5 hover:bg-stone-200 hover:text-slate-900 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </section>
      </div>

      {/* Copyright Section */}
      <section className="flex gap-9 justify-center items-center self-center mt-20 max-w-full text-xl text-stone-200 w-[684px] max-md:mt-10">
        <p className="self-stretch my-auto">
          @COPYRIGHT AJDAN | ALL RIGHTS RESERVED
        </p>
        <a
          href="#"
          className="self-stretch my-auto hover:underline"
        >
          Privacy Policy
        </a>
        <a
          href="#"
          className="self-stretch my-auto hover:underline"
        >
          Terms and Conditions
        </a>
      </section>

      {/* Discover Background */}
      <div className="mt-7 h-auto w-full bg-black max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="w-[83%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-wrap items-center mt-0 whitespace-nowrap text-[150px] text-slate-700 max-md:mt-3.5 max-md:text-4xl">
              {discoverLetters.map((letter, index) => (
                <span
                  key={index}
                  className="self-stretch my-auto max-md:text-xl"
                  aria-hidden="true"
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>
          <div className="ml-5 w-[17%] max-md:ml-0 max-md:w-full">
            <div className="flex items-center mt-0 whitespace-nowrap text-[150px] text-slate-700 max-md:mt-3.5 max-md:text-4xl">
              {neLetters.map((letter, index) => (
                <span
                  key={index}
                  className="self-stretch my-auto max-md:text-4xl"
                  aria-hidden="true"
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;