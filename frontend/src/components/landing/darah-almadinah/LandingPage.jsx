import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getListingByIdentifier } from '../../../services/getListingByIdentifier';
import ContactForm from '../PopupContactForm';
import logo from "./images/darahnew.png";
import mobile from "./images/darahimgmobile.webp";
import darklogo from "./images/ajdan.png";
import bg from "./images/darahimg.webp";
import wa from "./images/whatsapp.png";
import ajdan from "./images/logoajdan.png";
import { Menu, X } from "lucide-react";
import slider1 from "./images/darah1.webp";
import slider2 from "./images/darah2.webp";
import slider3 from "./images/darah3.webp";
import slider4 from "./images/darah4.webp";
import toast from "react-hot-toast";
import arrowleft from "./images/arrow-left.png";
import arrowright from "./images/arrow-right.png";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaXTwitter, FaTiktok, FaLinkedin } from "react-icons/fa6";

function  DarahAlmadinah() {
  const [data, setData] = useState(null);
   const { t, i18n } = useTranslation();
    const slides = [slider1, slider2, slider3, slider4];
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [phone, setPhone] = useState("");
  const [selected, setSelected] = useState("");
    const [selected1, setSelected1] = useState("");

   useEffect(() => {
  const loadData = async () => {
    try {
      const result = await getListingByIdentifier('darah-almadinah', i18n.language);
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data. Please try again later.");
    }
  };

  loadData();
}, [i18n.language]);

 
  //  const isArabic = i18n.language === 'ar';
 
  //  if (!data) return <p>{t('loading')}...</p>;
 
  //  // Helper function to get localized field
  //  const getLocalized = (field) => {
  //    return (isArabic && data[`${field}_ar`]) ? data[`${field}_ar`] : data[field];
  //  };
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
      <motion.div className="relative flex items-center justify-center w-full min-h-[200px] overflow-hidden hero">
        {/* Background Image with Zoom */}
        {/* Desktop Background */}
        <motion.img
          src={bg} // desktop image
          alt="Background"
          initial={{ scale: 1.1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 22, ease: "easeOut" }}
          className="hidden sm:block absolute inset-0 w-full h-full object-center object-cover"
        />

        {/* Mobile Background */}
        <motion.img
          src={mobile} // mobile image
          alt="Background Mobile"
          initial={{ scale: 1.1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 22, ease: "easeOut" }}
          className="sm:hidden absolute inset-0 w-full h-full object-left object-center object-cover"
        />

        {/* Mobile background */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(1, 44, 70, 0.6)  0%, rgba(93, 133, 149, 0.1) 100%, rgba(47, 43, 37, 1) 30%)",
          }}
        />

        {/* Desktop background */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(rgba(1, 44, 70, 0.5) 20%, rgba(93, 133, 149, 0.3) 100%, rgb(47, 43, 37, 0) 30%)",
          }}
        />

        {/* Top Bar */}
        <motion.header
          initial={{ y: -50, opacity: 0 }} // Start slightly above and invisible
          animate={{ y: 0, opacity: 1 }} // Move to original position and fully visible
          transition={{ duration: 1, ease: "easeOut" }} // Smooth fade-in
           className="absolute top-3 sm:top-6 left-0 right-0 sm:left-4 sm:right-4 px-4 flex items-center justify-between z-50"
        >
          {/* Left Logo */}
          <img
            src={logo}
            alt="Bayfront Logo"
            className="object-contain   w-32 md:w-44"
          />

          <div className="flex items-center gap-0 ml-auto md:gap-0">
            {/* Download Button */}
            <a
              href="/Darah-Almadinah.pdf"
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
                className="relative px-3 sm:px-4 text-[9px] sm:text-[9px]
           font-regular font-azer 
           text-white rounded-sm shadow border-[1.5px]
           border-[#C28560] bg-transparent
           hover:from-[#8A421F] hover:to-[#C28560]"
              >
                <span style={{ fontFamily: "AzerFont", fontWeight: 400 }}>DOWNLOAD BROCHURE</span>
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

        {/* Mobile Ajdan logo (replaces burger menu) */}
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
                         font-regular font-azer
                         text-white shadow
                         border-[1.5px] border-[#C28560] rounded-sm
                       
                         bg-transparent
                       
                       "
                               >
                                 <span style={{ fontFamily: "AzerFont", fontWeight: 400 }}>DOWNLOAD BROCHURE</span>
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
          className="w-full sm:w-[100%] md:w-[100%] lg:w-[100%] max-w-6xl mx-auto px-4 min-h-screen raseenmargintop
                    flex flex-col justify-center md:grid md:grid-cols-2 items-center text-white relative z-10 gap-8 md:gap-12 lg:gap-16"
        >
          {/* Left Content */}
          <div className="text-center md:px-4 md:pr-6 lg:px-12 md:text-left">
            {/* Heading - from top */}
            <motion.h1
              initial="hiddenTop"
              animate="showTop"
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }} // starts after 0.5s
              variants={textVariants}
              className="text-white "
            >
              {/* First line: bigger on mobile, line-height changes per breakpoint */}
              <span className="bayfront-heading uppercase block text-[30px] md:text-[24px] lg:text-[32px] xl:text-[36px]"
             style={{
  fontFamily: 'AzerFont',
  fontWeight: 400,
  textBoxTrim: 'trim-both', 
}} >

              Darah
              </span>

              {/* Second line: slightly smaller with responsive line-height */}
             <span className="bayfront-subheading block whitespace-nowrap text-[24px] pt-4 md:text-[20px] lg:text-[28px] xl:text-[30px] sm:mt-1 md:mt-0"
             style={{ fontFamily: "AzerFont", fontWeight: 400,  textBoxTrim: 'trim-both',  }}>
               Homes that Embrace All
              </span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className="hidden md:block my-6 origin-left border-t border-white/80"
            />

            {/* Subheading & Tagline - visible only on md+ screens (above form) */}
            {/* <div className="hidden md:block">
              <motion.h2
                initial="hiddenBottom"
                animate="showBottom"
                transition={{ duration: 1.5, ease: "easeOut", delay: 1.0 }}
                variants={textVariants}
                className="max-w-lg 
     ml-[-14px] mx-auto md:mx-0 text-[24px] sm:text-[32px] md:text-[20px] text-white "
     style={{ fontFamily: "AzerFont", fontWeight: 400 }}
              >
               Where Families Thrive
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
            style={{ fontFamily: "AzerFont", fontWeight: 400, fontSize: "12px" }}
              className="
       mb-4
       text-[12px]        /* mobile default */
       xs:text-[12px]     /* extra small screens */
       sm:text-[14px]     /* small screens */
       md:text-md         /* medium (14px) and up */
    
    
       text-start text-[#FFFFFF]
       uppercase register
     "
            >
             Register Your Interest
            </h2>
            <form
              className="flex flex-col gap-2"
              onSubmit={handleSubmit}
            >
              {/* Full Name */}
              <input id=""
              style={{ fontFamily: "AzerFont", fontWeight: 400, fontSize: "12px" }}
                type="text"
                placeholder="FULL NAME"
                className="w-full h-10 text-[10px] sm:text-[10px] text-white
       bg-[#012C46] rounded-sm border border-[#5D8595]
       focus:border-[#ffffff] focus:outline-none
       placeholder:text-[12px] placeholder-[#5D8595] uppercase
       pl-4 pr-2 py-3 font-azer"
              />

              {/* Email Address */}
              <input
              style={{ fontFamily: "AzerFont", fontWeight: 400, fontSize: "12px" }}
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full h-10 text-[10px] sm:text-[10px] text-white
       bg-[#012C46] rounded-sm border border-[#5D8595]
       focus:border-[#ffffff] focus:outline-none
       placeholder:text-[12px] sm:placeholder:text-[10px] placeholder-[#5D8595]
       pl-4 pr-2 py-3 font-azer "
              />

              {/* Phone */}
              <div className="flex w-full gap-2 phone-stack">
             <select
  value={selected1}
  onChange={(e) => setSelected1(e.target.value)}
  style={{ color: selected1 === "" ? "#5D8595" : "#FFFFFF" }} // ✅ dynamic color
  className="w-20 h-10 text-[10px] font-chapaza 
    rounded-sm bg-[#012C46] border border-[#5D8595] 
    focus:border-[#ffffff] focus:outline-none appearance-none 
    px-3 font-normal"
>
  <option value="" disabled hidden>
    +966
  </option>
  <option value="+966">+966</option>
  <option value="+971">+971</option>
</select>

                <input
                  type="tel"
                   style={{ fontFamily: "AzerFont", fontWeight: 400, fontSize: "12px" }}
                  placeholder="MOBILE NUMBER"
                  className="flex-1 text-[10px] h-10 sm:text-[10px] text-white
         bg-[#012C46] rounded-sm border border-[#5D8595]
         focus:border-[#ffffff] focus:outline-none
         px-3 py-2 sm:px-4 sm:py-3 pl-4 pr-2 
         placeholder:text-[12px] sm:placeholder:text-[10px] placeholder-[#5D8595]
         min-h-[35px] sm:min-h-auto font-azer"
                />
              </div>

              {/* Select Reason */} 
    <div className="relative w-full">
  <select
    value={selected}
    onChange={(e) => setSelected(e.target.value)}
    className={`w-full h-10 leading-normal bg-[#012C46] rounded-sm border border-[#5D8595] 
      focus:border-[#ffffff] focus:outline-none appearance-none px-4 py-2 font-azer min-h-[35px] sm:min-h-auto `}
    style={{
      fontFamily: "AzerFont",
      fontWeight: 400,
      fontSize: "10px",
      color: selected ? "#FFFFFF" : "#5D8595"  // ✅ change color based on selection
    }}
  >
    <option value="" disabled hidden>
      I WOULD LIKE MORE DETAILS TO
    </option>
    <option value="location1">RESERVE A VILLA</option>
    <option value="location2">LEARN MORE ABOUT THE PROJECT</option>
    <option value="location3">MAKE OTHER APPOINTMENT WITH A SALES AGENT</option>
    <option value="location4">OTHER REASON</option>
  </select>

  <span className="absolute text-[12px] -translate-y-1/2 pointer-events-none sm:text-[10px] text-[#5D8595] right-3 top-1/2">
    ▼
  </span>
</div>


              {/* Submit Button */}

              <button
                type="submit"
                className="w-full  py-2 sm:py-2  text-white 
    rounded-sm bg-gradient-to-r from-[#8A421F] to-[#C28560] 
    hover:from-[#C28560] hover:to-[#8A421F] sm:text-[12px]
    transition-all duration-700 ease-in-out text-[12px] items-center justify-center"
              >
               <span style={{ fontFamily: "AzerFont", fontWeight: 400 }}>SUBMIT</span>
              </button>
            </form>
            {/* Buttons Row (under form) */}
            <div className="flex items-center justify-between mt-4 sm:mt-6 w-full">
              {/* Mobile / XS Button */}
              {/* {isMobile && (
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="sm:hidden"
                >
                  <a
                    href="/Raseen-Sedra.pdf"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button
                      className=" px-4 h-8 text-[10px] text-white 
            bg-gradient-to-r from-[#8A421F] to-[#C28560]
            rounded-sm shadow overflow-hidden 
            flex items-center justify-center whitespace-nowrap
            hover:from-[#C28560] hover:to-[#8A421F]"
                    >
                     <span style={{ fontFamily: "AzerFont", fontWeight: 400 }}>DOWNLOAD BROCHURE</span> 
                    </button>
                  </a>
                </motion.div>
              )} */}

              {/* WhatsApp Icon */}
              <a
                href="https://wa.me/XXXXXXXXXXX" // replace with your WhatsApp link
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:hidden transition hover:scale-110 ml-[1px]" // shift 1px right
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
            {/* <motion.h3
              initial="hiddenBottom"
              animate="showBottom"
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              variants={textVariants}
              className="text-[20px] w-94 sm:text-[18px] md:text-[40px] lg:text-[52px] xl:text-[56px] text-white  mb-4 bayfront-subheading"
            >
              <span style={{ fontFamily: "AzerFont", fontWeight: 400 }}>Where Families Thrive</span>
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
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}   // 👈 fade in when in view
        viewport={{ once: true, amount: 0.2 }} // triggers when 20% is visible
        transition={{ duration: 2, ease: "easeOut" , delay:0.3 }} // 👈 2 seconds fade in
      >
        <img
          src={slide}
          alt={`Slide ${index + 1}`}
          loading="lazy"
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
        whileInView={{ opacity: 1, scale: 1.05 }} // fade in + slight scale
        viewport={{ once: true, amount: 0.2 }}     // trigger when 20% visible
        transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
        drag={index === current ? "x" : false}    // keep drag for current slide
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset, velocity }) => {
          if (index !== current) return;
          if (offset.x > 100 || velocity.x > 500) {
            setCurrent(prev => (prev === 0 ? slides.length - 1 : prev - 1));
          } else if (offset.x < -100 || velocity.x < -500) {
            setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
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
        <div className="absolute flex z-40 justify-center w-full gap-2 bottom-3 md:bottom-5">
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
          className="absolute flex items-center z-50 justify-center w-10 h-10 -translate-y-1/2 left-3 top-1/2 md:w-12 md:h-12"
        >
          <img src={arrowleft} alt="Previous" className="h-6 md:h-8" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() =>
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
          }
          className="absolute flex items-center justify-center z-50 w-10 h-10 -translate-y-1/2 right-3 top-1/2 md:w-12 md:h-12"
        >
          <img src={arrowright} alt="Next" className="h-6 md:h-8" />
        </button>
      </div>

      <footer className="w-full">
        {/* Top Section */}
        <div className="py-8 bg-[#F2F2F2]">
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
                    className="flex items-center justify-center w-6 h-6 bg-[#012C46] text-white text-base rounded-sm hover:bg-[#A4763E] transition"
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
        <div className="bg-[#012C46] py-4">
          <div className="max-w-[1340px] mx-auto px-6 flex items-center justify-center">
            <p className="text-[9px] text-center text-white md:text-[10px]">
             <span style={{ fontFamily: "AzerFont", fontWeight: 400 }}>© COPYRIGHT</span> {" "}
              <a
                href="https://ajdan.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
               <span style={{ fontFamily: "AzerFont", fontWeight: 400 }}>AJDAN</span> 
              </a>{" "}
             <span style={{ fontFamily: "AzerFont", fontWeight: 400 }}> | ALL RIGHTS RESERVED.</span>
            </p>
          </div>
        </div>
      </footer>
    </>
    );
};

export default DarahAlmadinah;