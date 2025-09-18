import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getListingByIdentifier } from "../../../services/getListingByIdentifier";
import ContactForm from "../PopupContactForm";
import logo from "./images/bayfront_top.png";
import footerlogo from "./images/al_muhaidib.png";
import darklogo from "./images/ajdan.png";
import bg from "./images/bayfront-bg.webp";
import mobileBg from "./images/bg_bayfront.png";
import wa from "./images/whatsapp.png";
import arrowleft from "./images/arrow-left.png";
import arrowright from "./images/arrow-right.png";
import ajdan from "./images/logoajdan.png";
import slider1 from "./images/sec3.webp";
import slider2 from "./images/sec1.webp";
import slider3 from "./images/v01.webp";
import slider4 from "./images/v06.webp";

import { Menu, X } from "lucide-react";
import { FaInstagram, FaXTwitter, FaTiktok, FaLinkedin } from "react-icons/fa6";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const AjdanBayfront = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const slides = [slider1, slider2, slider3, slider4];
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  // const [phone, setPhone] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [selected, setSelected] = useState("");
  const [selected1, setSelected1] = useState("");
  // const [phone, setPhone] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getListingByIdentifier("bayfront", i18n.language);
        setData(result);
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, [i18n.language]);

/* The above code is a JavaScript function that checks if the current language in the i18n object is
Arabic. If the language is Arabic, it retrieves a localized field value from the data object using
the field name suffixed with "_ar" (for Arabic). If the language is not Arabic or the localized
field value is not available, it falls back to retrieving the default field value from the data
object. */
  // const isArabic = i18n.language === "ar";

  // const getLocalized = (field) => {
  //   return isArabic && data && data[`${field}_ar`] ? data[`${field}_ar`] : data && data[field];
  // };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768); // or 480 for smaller phones
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!data) return <p>{t("loading")}...</p>;

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Form submitted successfully!");
  };

  const textVariants = {
    hiddenTop: { y: -80, opacity: 0 }, // from top
    showTop: { y: 0, opacity: 1 },

    hiddenBottom: { y: 50, opacity: 0 }, // from bottom
    showBottom: { y: 0, opacity: 1 },
  };
  const icons = [
    {
      icon: FaInstagram,
      alt: "Instagram",
      link: "https://www.instagram.com/Ajdan_sa/",
    },
    { icon: FaXTwitter, alt: "X Twitter", link: "https://x.com/Ajdan" },
    { icon: FaTiktok, alt: "TikTok", link: "https://www.tiktok.com/" },
    {
      icon: FaLinkedin,
      alt: "LinkedIn",
      link: "https://www.linkedin.com/company/ajdan/",
    },
  ];

  return (
    <>
      <motion.div className="relative flex items-center justify-center w-full min-h-screen overflow-hidden hero">
        {/* Desktop Background */}
        <motion.img
          src={bg} // desktop image
          alt="Background"
          initial={{ scale: 1.1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 22, ease: "easeOut" }}
          className="absolute inset-0 hidden object-cover object-center w-full h-full sm:block"
        />

        {/* Mobile Background */}
        <motion.img
          src={mobileBg} // mobile image
          alt="Background Mobile"
          initial={{ scale: 1.1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 22, ease: "easeOut" }}
          className="sm:hidden absolute inset-0 w-full h-[100vh] object-left object-center object-cover"
        />

        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(180.09deg, rgba(18,74,99,0.6) 10%, rgba(60,113,119,0) 80%)",
          }}
        />

        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute left-0 right-0 z-50 flex items-center justify-between px-4 top-3 sm:top-6 sm:left-4 sm:right-4"
        >
          {/* Left Logo */}
          <img
            src={logo}
            alt="Bayfront Logo"
            className="object-contain w-20 md:w-32"
          />

          {/* Right Side: Download + Ajdan Logo */}
          <div className="flex items-center gap-0 ml-auto md:gap-0">
            {/* Mobile: Fixed Download Button */}
            <a
              href="/Bayfront-Brochure.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="z-50 flex items-center left-4 sm:hidden"
            >
              <button
                style={{
                  lineHeight: "1",
                  paddingTop: 0,
                  paddingBottom: 0,
                  height: 28,
                }}
                className="
        relative px-3 sm:px-4 text-[9px]  sm:text-[9px]
        font-regular font-commuter
        text-white shadow
        border-[1.5px]  border-[#C1A580] rounded-sm
        bg-transparent
        hover:from-[#BFA057] hover:to-[#A4763E]
      "
              >
                DOWNLOAD BROCHURE
              </button>
            </a>

            {/* Mobile: Small Ajdan Logo */}
            <div className="sm:hidden ml-2 h-7 w-7 flex items-center justify-center rounded-sm bg-gradient-to-r from-[#C1A580] to-[#C1A580]">
              <a
                href="https://ajdan.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={ajdan}
                  alt="Logo"
                  className="object-contain w-auto h-4"
                />
              </a>
            </div>

            {/* Desktop/Tablet Download + Ajdan Logo */}
            <div className="items-center hidden gap-2 sm:flex md:gap-6">
              <a
                href="/Bayfront-Brochure.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  style={{
                    lineHeight: "1",
                    paddingTop: 0,
                    paddingBottom: 0,
                    height: 28,
                  }}
                  className="
          relative  px-3 sm:px-4 text-[12px] text-xs sm:text-[12px]
          font-regular font-commuter
          text-white shadow
          border-[1.5px] border-[#C1A580] rounded-sm
        
          bg-transparent
        
        "
                >
                  DOWNLOAD BROCHURE
                </button>
              </a>

              <a
                href="https://ajdan.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={ajdan} alt="Logo" className="h-7 sm:h-7" />
              </a>
            </div>
          </div>
        </motion.header>

        <main
          className="w-full sm:w-[100%] md:w-[100%] lg:w-[100%] max-w-6xl mx-auto px-4 min-h-screen
                 flex flex-col justify-center md:grid md:grid-cols-2  items-center text-white relative margintop"
        >
          {/* Left Content */}
          <div className="text-center md:pr-6 md:px-4 lg:px-12 md:text-left">
            {/* Heading - from top */}
            <motion.h1
              initial="hiddenTop"
              animate="showTop"
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              variants={textVariants}
              className="leading-none text-white font-chapaza font-regular" // leading-none removes extra line height
            >
              <span className="bayfront-heading uppercase block text-[30px] md:text-[24px] lg:text-[32px] xl:text-[36px] ">
                Bayfront
              </span>

              <span className="bayfront-subheading block pt-4 whitespace-nowrap text-[24px] md:text-[20px] lg:text-[28px] xl:text-[30px] sm:mt-1 mb-4 md:mb-0 mt-10px-sm">
                Where You Meet the Beach
              </span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className="hidden my-6 origin-left border-t md:block border-white/80"
            />

            {/* Subheading & Tagline - visible only on md+ screens (above form) */}
            {/* <div className="hidden md:block">
              <motion.h2
                initial="hiddenBottom"
                animate="showBottom"
                transition={{ duration: 1.5, ease: "easeOut", delay: 1.0 }}
                variants={textVariants}
                className="max-w-lg 
  ml-[-14px] mx-auto md:mx-0 text-[24px] sm:text-[32px] md:text-[20px] text-white font-chapaza"
              >
                Where Luxury Meets
              </motion.h2>
            </div> */}
          </div>

          {/* Right Form Card */}
          <motion.div
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            className="w-full max-w-xl xs:w-[95%]  sm:p-8 md:p-4 lg:p-12 mx-6 sm:mx-8 md:mx-auto bg-no-repeat sm:mt-0"
          >
            <h2
              className="
    mb-4
    text-[10px]        /* mobile default */
    xs:text-[10px]     /* extra small screens */
    sm:text-[12px]     /* small screens */
    md:text-sm         /* medium (14px) and up */
    font-commuter font-regular
 
    text-start text-[#FFFFFF]
    uppercase register
  "
            >
              Register Your Interest
            </h2>
            <form
              className="flex flex-col gap-2 font-commuter font-regular"
              onSubmit={handleSubmit}
            >
              {/* Full Name */}
              <input
                type="text"
                placeholder="FULL NAME"
                className="w-full h-10 text-[10px] text-white
      bg-[#124A63] rounded-sm border border-[#AFD4E0]
      focus:border-[#ffffff] focus:outline-none
      placeholder:text-[9px] placeholder-[#D7E0E2] uppercase
      px-4"
              />

              {/* Email Address */}
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full h-10 text-[10px] text-white
      bg-[#124A63] rounded-sm border border-[#AFD4E0]
      focus:border-[#ffffff] focus:outline-none
      placeholder:text-[9px] placeholder-[#D7E0E2]
      px-4"
              />

              {/* Phone */}
              <div className="flex w-full gap-2 phone-stack">
                <select
                  value={selected1} // ✅ match the state
                  onChange={(e) => setSelected1(e.target.value)} // ✅ update the right state
                  className={`w-20 h-10 text-[11px] text-[#D7E0E2] font-chapaza 
        rounded-sm bg-[#124A63] border border-[#AFD4E0] 
        focus:border-[#ffffff] focus:outline-none appearance-none 
        px-3 font-normal
         ${selected1 === "" ? "text-[#D7E0E2]" : "text-white"}`}
                >
                  <option value="" disabled>
                    +966
                  </option>
                  <option value="+966">+966</option>
                  <option value="+971">+971</option>
                </select>

                <input
                  type="tel"
                  placeholder="MOBILE NUMBER"
                  className="flex-1 h-10 text-[10px] text-white
        bg-[#124A63] rounded-sm border border-[#AFD4E0]
        focus:border-[#ffffff] focus:outline-none
        px-4 placeholder:text-[9px] placeholder-[#D7E0E2]"
                />
              </div>

              {/* Select Reason */}
              <div className="relative w-full">
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className={`w-full h-10 text-[9px] sm:text-[9px]
      bg-[#124A63] rounded-sm border border-[#AFD4E0]
      focus:border-[#ffffff] focus:outline-none appearance-none
      px-3 py-2 sm:px-4 sm:py-3 pl-4 pr-2 min-h-[35px] sm:min-h-auto
      ${selected === "" ? "text-[#D7E0E2]" : "text-white"}`}
                >
                  <option
                    value=""
                    disabled
                    className="text-[9px] text-[#D7E0E2]"
                  >
                    I WOULD LIKE MORE DETAILS TO
                  </option>
                  <option value="location1" className="text-[9px] text-white">
                    BOOK A SPACE
                  </option>
                  <option value="location2" className="text-[9px] text-white">
                    LEARN MORE ABOUT THE PROJECT
                  </option>
                  <option value="location3" className="text-[9px] text-white">
                    MAKE OTHER APPOINTMENT WITH A SALES AGENT
                  </option>
                  <option value="location4" className="text-[9px] text-white">
                    OTHER REASON
                  </option>
                </select>

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#D7E0E2] pointer-events-none">
                  ▼
                </span>
              </div>

              {/* Message (taller) */}
              <textarea
                rows="4"
                placeholder="WRITE A MESSAGE"
                className="w-full text-[10px] text-white
      bg-[#124A63] rounded-sm border border-[#AFD4E0]
      focus:border-[#ffffff] focus:outline-none
      px-4 py-3 resize-none placeholder:text-[10px] placeholder-[#D7E0E2]"
              />

              {/* Submit Button */}
              <div
                className="p-[1px] rounded-sm bg-gradient-to-r from-[#a4763e] to-[#bba776] 
    hover:bg-gradient-to-l transition-all duration-700 ease-in-out 
    bg-clip-padding box-border"
              >
                <button
                  type="submit"
                  className="w-full font-regular text-white 
      rounded-sm bg-gradient-to-r from-[#A4763E] to-[#BFA057] 
      hover:from-[#BFA057] hover:to-[#A4763E] text-[10px] md:text-[12px]
      transition-all duration-700 ease-in-outitems-center justify-center"
                >
                  SUBMIT
                </button>
              </div>
            </form>

            {/* Buttons Row (under form) */}
            <div className="flex items-center justify-between w-full mt-4 sm:mt-6">
              {/* Mobile / XS Button - FIXED: Always render motion.div but conditionally show content */}
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                className={isMobile ? "block" : "hidden"}
              >
                {isMobile && (
                  <a
                    href="/Bayfront-Brochure.pdf"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button
                      className="h-8 px-4 text-[10px] text-white 
            bg-gradient-to-r from-[#A4763E] to-[#BFA057]
            rounded-sm shadow overflow-hidden font-commuter
            flex items-center justify-center whitespace-nowrap
            hover:from-[#BFA057] hover:to-[#A4763E]"
                    >
                      DOWNLOAD BROCHURE
                    </button>
                  </a>
                )}
              </motion.div>

              {/* WhatsApp Icon */}
              <a
                href="https://wa.me/XXXXXXXXXXX" // replace with your WhatsApp link
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:hidden  transition hover:scale-110 ml-[1px]" // shift 1px right
              >
                <img
                  src={wa}
                  alt="WhatsApp"
                  className="object-contain w-8 sm:w-12 sm:h-12 drop-shadow-lg"
                />
              </a>
            </div>
          </motion.div>
          {/* Subheading & Tagline - visible only on sm/xs (below form) */}
          <div className="block md:hidden text-start w-[94%] ml-0">
            {/*  <motion.h3
              initial="hiddenBottom"
              animate="showBottom"
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              variants={textVariants}
              className="text-[20px] sm:text-[18px] mt-4 md:text-[40px] lg:text-[52px] xl:text-[56px] text-white font-chapaza bayfront-subheading"
            >
              Where Luxury Meets
            </motion.h3> */}

            {/* <motion.h3
              initial="hiddenBottom"
              animate="showBottom"
              transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
              variants={textVariants}
              className="mt-2 text-white text-[12px] sm:text-[13px] font-fontspring"
            >
              EXCLUSIVE LIFESTYLE BY THE SHORE.
            </motion.h3> */}
          </div>
        </main>

        {/* WhatsApp Floating Icon (bottom-right) */}
        <a
          href="https://wa.me/XXXXXXXXXXX" // replace with your WhatsApp link
          target="_blank"
          rel="noopener noreferrer"
          className="fixed right-0 z-50 block p-2 transition sm:block sm:p-6 bottom-2 sm:bottom-6 sm:right-6 hover:scale-110"
        >
          <img
            src={wa}
            alt="WhatsApp"
            className="object-contain w-10 h-10 pt-3 mr-1 sm:w-12 sm:h-12 drop-shadow-lg"
          />
        </a>
      </motion.div>
      <div className="relative w-full overflow-hidden h-72 md:h-screen">
        {/* Desktop & larger screens (md+) */}

        {!isMobile && (
          <>
            {slides.map((slide, index) => (
              <motion.div
                key={`${index}-${slide}`}
                className={`absolute inset-0 transition-all duration-200 ${
                  index === current ? "z-10" : "z-0 pointer-events-none"
                }`}
                initial={{ opacity: 0, scale: 1 }}
                animate={{
                  opacity: index === current && scrollY > 50 ? 1 : 0, // same as mobile
                  scale: index === current ? 1.05 : 1,
                }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{
                  opacity: { duration: 3, ease: "easeOut", delay: 0.2 }, // slow fade
                  scale: { duration: 6, ease: "linear" },
                }}
                drag={false} // no drag on desktop
              >
                <img
                  src={slide}
                  alt={`Slide ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </motion.div>
            ))}
          </>
        )}

        {/* Mobile & Tablet (sm/xs) */}

        {isMobile && (
          <>
            {slides.map((slide, index) => (
              <motion.div
                key={`${index}-${slide}`}
                className={`absolute inset-0 transition-all duration-200 ${
                  index === current ? "z-10" : "z-0 pointer-events-none"
                }`}
                initial={{ opacity: 0, scale: 1 }}
                animate={{
                  opacity: index === current && scrollY > 50 ? 1 : 0, // fade in on scroll
                  scale: index === current ? 1.05 : 1,
                }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{
                  opacity: { duration: 3, ease: "easeOut", delay: 0.2 }, // slow fade
                  scale: { duration: 6, ease: "linear" },
                }}
                drag={index === current ? "x" : false} // drag only current slide
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  if (index !== current) return;
                  if (offset.x > 100 || velocity.x > 500) {
                    setCurrent((prev) =>
                      prev === 0 ? slides.length - 1 : prev - 1
                    );
                  } else if (offset.x < -100 || velocity.x < -500) {
                    setCurrent((prev) =>
                      prev === slides.length - 1 ? 0 : prev + 1
                    );
                  }
                }}
              >
                <img
                  src={slide}
                  alt={`Slide ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </motion.div>
            ))}
          </>
        )}

        {/* Dots */}
        <div className="absolute z-40 flex justify-center w-full gap-2 bottom-3 md:bottom-5">
          {(isMobile ? slides.slice(0, 4) : slides).map((_, i) => {
            const activeIndex = isMobile ? current % 4 : current;
            return (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === i ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            );
          })}
        </div>

        {/* Left Arrow */}
        <button
          onClick={() =>
            setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
          }
          className="absolute z-50 flex items-center justify-center w-10 h-10 -translate-y-1/2 left-3 top-1/2 md:w-12 md:h-12"
        >
          <img src={arrowleft} alt="Previous" className="h-6 md:h-8" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() =>
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
          }
          className="absolute z-50 flex items-center justify-center w-10 h-10 -translate-y-1/2 right-3 top-1/2 md:w-12 md:h-12"
        >
          <img src={arrowright} alt="Next" className="h-6 md:h-8" />
        </button>
      </div>

      <footer className="w-full">
        {/* Top Section */}
        <div className="py-8 bg-[#E9E5DD]">
          <div className="flex items-center justify-between w-full px-6 md:px-12">
            {/* Social Icons - aligned left */}
            <div className="flex justify-start gap-5 xs:gap-3">
              {icons.map((iconData, index) => {
                const IconComp = iconData.icon;
                return (
                  <motion.a
                    key={iconData.alt}
                    href={iconData.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      delay: index * 0.3,
                      duration: 1,
                      ease: "easeOut",
                    }}
                    className="flex items-center justify-center w-6 h-6 bg-[#C1A580] text-white text-base rounded-sm hover:bg-[#A4763E] transition"
                  >
                    <IconComp />
                  </motion.a>
                );
              })}
            </div>

            {/* Logos - aligned right */}
            <motion.div
              className="flex items-center gap-6 sm:gap-5 xs:gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <img
                src={footerlogo}
                alt="Bayfront Logo"
                className="object-contain w-auto h-8 mr-2 sm:h-10 md:h-12"
              />
              <a href="https://ajdan.com/" className="inline-block">
                <img
                  src={darklogo}
                  alt="Dark Logo"
                  className="object-contain w-auto h-8 sm:h-10 md:h-12"
                />
              </a>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-[#124A63] py-4">
          <div className="max-w-[1340px] mx-auto px-6 flex items-center justify-center">
            <p className="text-[9px] text-center text-white font-commuter md:text-[10px]">
              © COPYRIGHT{" "}
              <a
                href="https://ajdan.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                AJDAN
              </a>{" "}
              <span className="font-chapaza">|</span> ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AjdanBayfront;
