import React, { useState } from "react";
import { Button, Input, Typography } from "@material-tailwind/react";
import { subscribeToNewsletter } from "../services/newsletterService"; // Import the newsletter service

function Footer() {
  const [email, setEmail] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Get user's IP address
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipRes.json();

    // Get current datetime in ISO format
    const currentDatetime = new Date().toISOString();

    // Send email + IP + datetime to the backend
    await subscribeToNewsletter({
      email,
      ip: ipData.ip,
      datetime: currentDatetime
    });

    console.log("Subscribed successfully:", email, ipData.ip, currentDatetime);
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
    "Residential & Commercial",
    "Contact Us",
  ];

  const partners = Array(5).fill(null);

  return (
    <>
      {/* Pre-Footer Section */}
      <div
        className="bg-gray-800 text-white flex items-center justify-center"
        style={{ height: "150px", backgroundColor: "#000000" }}
      >
        <section className="py-20 mx-auto container max-w-4xl px-8">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 !items-center">
            <Typography className="text-gray-500 !font-semibold">
              Stay in the Know: Subscribe for Exclusive Updates
            </Typography>
            <form
              onSubmit={handleSubmit}
              className="flex items-start flex-col gap-4 md:flex-row"
            >
              <Input
                label="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="flex-shrink-0 md:w-fit w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </div>

      <footer
        className="flex flex-col pt-10 text-stone-200 text-sm"
        style={{ backgroundColor: "#14202e" }}
      >
        <div className="flex flex-col items-end px-6 w-full  max-md:px-4">
          <div className="flex flex-wrap gap-5 justify-between self-stretch">
            {/* Navigation */}
            <nav className="text-sm">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/bc76ab510b473c2fd62f1ab0acc9a3488adee8ba?placeholderIfAbsent=true&apiKey=15fc2f5d6dad43d5af0854bebe07a404"
                alt="Ajdan Logo"
                className="object-contain mb-4"
                style={{ width: "100px" }}
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
    </>
  );
}

export default Footer;
