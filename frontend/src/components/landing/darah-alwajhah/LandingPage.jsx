import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getListingByIdentifier } from "../../../services/getListingByIdentifier";

import logo from "./images/Alwajha.png";
import mobileBg from "./images/mobile.webp";
import bg from "./images/darahalwajhah.webp";
import darklogo from "../../../assets/landing images/ajdan.png";
import wa from "../../../assets/landing images/whatsapp.png";
import arrowleft from "../../../assets/landing images/arrow-left.png";
import arrowright from "../../../assets/landing images/arrow-right.png";
import saFlag from "../../../assets/landing images/togglear.png";
import enFlag from "../../../assets/landing images/toggleen.png"; 
import ajdan from "../../../assets/landing images/logoajdan.png";
import { Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaXTwitter, FaTiktok, FaLinkedin } from "react-icons/fa6";
import { getSocialLinks } from "../../../services/socialiconService";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN || "";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{7,15}$/;

const compact = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([_, v]) => v !== undefined && v !== null && v !== ""
    )
  );

// LangToggle component (moved outside of AjdanBayfront)
const LangToggle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  // Get current language from URL or i18n
  const match = location.pathname.match(/^\/(en|ar)(\/|$)/);
  const [lang, setLang] = useState(match ? match[1] : i18n.language || "en");

  // Sync with i18n language changes
  useEffect(() => {
    setLang(i18n.language);
  }, [i18n.language]);

  const toggleLang = () => {
    const newLang = lang === "en" ? "ar" : "en";
    const newDirection = newLang === "ar" ? "rtl" : "ltr";

    // Update i18n
    if (i18n && typeof i18n.changeLanguage === "function") {
      i18n.changeLanguage(newLang);
    }

    // Update document direction
    document.documentElement.dir = newDirection;
    document.documentElement.lang = newLang;

    // Update URL routing
    const newPath = location.pathname.replace(/^\/(en|ar)/, `/${newLang}`);
    navigate(newPath + location.search, { replace: true });

    // Update local state
    setLang(newLang);
  };

  const items = {
    ar: { label: "AR", flag: saFlag },
    en: { label: "EN", flag: enFlag },
  };

  return (
    <div
      onClick={toggleLang}
      className="relative flex items-center justify-center w-10 h-16 overflow-hidden bg-white rounded-full shadow-lg cursor-pointer md:h-16 md:w-10"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={lang}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute flex flex-col items-center"
        >
          <img
            src={items[lang].flag}
            alt={items[lang].label}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-[10px] font-bold text-blue-900 mt-1">
            {items[lang].label}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Success Popup Component (moved outside of AjdanBayfront)
const SuccessPopup = ({ open, onClose, title, body, okLabel = "OK" }) => {
  const logoTile = ajdan; // Using the same ajdan image import

  // close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const Backdrop = ({ onClose }) => (
    <div
      className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-[1px]"
      onClick={onClose}
      aria-hidden="true"
    />
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <Backdrop onClose={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed z-[9999] inset-0 grid place-items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="w-full max-w-xs rounded-2xl shadow-2xl ring-1 ring-[#1aa0e0]/40 overflow-hidden"
            >
              <div className="bg-[#E9E5DD] p-6 text-center relative">
                <div className="mx-auto mb-4 h-10 w-10 rounded-lg grid place-items-center bg-[#c1a580]">
                  <img
                    src={logoTile}
                    alt=""
                    className="object-contain w-5 h-5"
                    draggable="false"
                  />
                </div>

                <h3 className="sr-only">{title}</h3>
                <p
                  style={{ fontFamily: "AzerFont", fontWeight: 400 }}
                  className="text-[13px] leading-5  text-[#2E2924]"
                >
                  {body}
                </p>

                <div className="mt-6">
                  <button
                    style={{ fontFamily: "AzerFont", fontWeight: 400 }}
                    onClick={onClose}
                    className="w-24 h-9 rounded-md text-white text-[12px] 
                               bg-gradient-to-r from-[#8A421F] to-[#C28560]
                               hover:from-[#C28560] hover:to-[#8A421F]
                               transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    {okLabel}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const DarahAlwajhah = () => {
  const { t, i18n } = useTranslation();

  const [data, setData] = useState(null);
  // const slides = [slider1, slider2, slider3, slider4];
  const slides = (data?.gallery_images || []).map(
    (img) => `${STRAPI_URL}${img}`
  );
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [socialLinks, setSocialLinks] = useState({});
  // SuccessPopup
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Build options from i18n so labels auto-translate
  const MORE_DETAIL_OPTIONS = [
   { code: "reserve_villa", value: "Reserve a Villa", label: t("reserve_villa") },
    {
      code: "learn_more",
      value: "Learn more about the project",
      label: t("learn_more"),
    },
    {
      code: "appointment",
      value: "Make an appointment with sales",
      label: t("appointment"),
    },
    { code: "other", value: "Other reason", label: t("other_reason") },
  ];

  // track only the code in UI (stable)
  const [moreDetailsCode, setMoreDetailsCode] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    message: "",
    title: "",
  });
  const [dialCode, setDialCode] = useState("+966");
  const [errors, setErrors] = useState({});

  // Validate form function
  const validateForm = (formData, moreDetailsCode) => {
    const errors = {};

    // Name validation
    if (!formData.username?.trim()) {
      errors.username = t("name_required");
    }

    // Email validation
    if (!formData.email?.trim()) {
      errors.email = t("email_required");
    } else if (!EMAIL_RE.test(formData.email)) {
      errors.email = t("invalid_email");
    }

    // Phone validation
    if (!formData.phone?.trim()) {
      errors.phone = t("phone_required");
    } else if (!PHONE_RE.test(formData.phone.replace(/\D/g, ""))) {
      errors.phone = t("invalid_phone");
    }

    // Dropdown validation - make sure the key matches what you're checking in the JSX
    if (!moreDetailsCode) {
      errors.moreDetailsCode = t("selection_required"); // This key must match what you check in JSX
    }

    return errors;
  };

  // set title after fetch so it never flips undefined → string
  const resolveTitle = (d, lang) => {
    if (!d) return "";
    return lang === "ar"
      ? d.title_ar || d?.attributes?.title_ar || ""
      : d.title || d?.attributes?.title || "";
  };

  const resolveDescription = (d, lang) => {
    if (!d) return "";
    return lang === "ar"
      ? d.description_ar || d?.attributes?.description_ar || ""
      : d.description || d?.attributes?.description || "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const formErrors = validateForm(formData, moreDetailsCode);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    // map the selected code to readable text
    const selected = MORE_DETAIL_OPTIONS.find(
      (o) => o.code === moreDetailsCode
    );
    const moreDetailsText = selected?.value || "";

    const rawPayload = {
      username: formData.username ?? "",
      email: formData.email ?? "",
      phone: `${dialCode ?? "+966"}${(formData.phone ?? "").replace(
        /^0+/,
        ""
      )}`,
      message: formData.message ?? "",
      title: formData.title ?? (data?.title || "Raseen"),
      more_details: moreDetailsText,
    };
    const payload = compact(rawPayload);

    const headers = { "Content-Type": "application/json" };
    if (STRAPI_TOKEN) headers.Authorization = `Bearer ${STRAPI_TOKEN}`;

    try {
      const res = await fetch(`${STRAPI_URL}/api/project-contact-forms`, {
        method: "POST",
        headers,
        body: JSON.stringify({ data: payload }),
      });

      const raw = await res.text();
      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        body = raw;
      }

      if (!res.ok) {
        const msg =
          body?.error?.message ||
          body?.error?.details?.errors?.map((e) => e.message).join(", ") ||
          (res.status === 401
            ? "Unauthorized: add a Bearer token or enable Public → Create in Strapi."
            : "Submission failed");
        throw new Error(msg);
      }

      // success → open popup
      setShowSuccess(true);

      // reset fields (keep resolved title)
      setFormData((prev) => ({
        ...prev,
        username: "",
        email: "",
        phone: "",
        message: "",
        title: formData.title || resolveTitle(data, i18n.language) || "",
      }));
      setMoreDetailsCode("");
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    getSocialLinks(i18n.language).then(setSocialLinks);
  }, [i18n.language]);

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        title: resolveTitle(data, i18n.language),
      }));
    }
  }, [data, i18n.language]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getListingByIdentifier(
          "darah-alwajhah",
          i18n.language
        );
        setData(result);
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    loadData();
  }, [i18n.language]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
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

  useEffect(() => {
    getSocialLinks()
      .then((data) => {
        setSocialLinks(data); // should already be { instagram, twitter, tiktok, linkedin }
        console.log(data);
      })
      .catch((err) => console.error("Error fetching social links:", err));
  }, []);

  if (!data) return <p>{t("loading")}...</p>;

  const textVariants = {
    hiddenTop: { y: -80, opacity: 0 },
    showTop: { y: 0, opacity: 1 },
    hiddenBottom: { y: 50, opacity: 0 },
    showBottom: { y: 0, opacity: 1 },
  };

  return (
    <>
      <motion.div className="relative flex items-center justify-center w-full min-h-screen overflow-hidden hero">
        {/* Desktop Background */}
        {/* Desktop Background Image */}
        <motion.img
          src={bg}
          alt="Background"
          initial={{ scale: 1.1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 22, ease: "easeOut" }}
          className="absolute inset-0 hidden sm:block w-full h-full object-cover object-center"
          style={{
            transform: i18n.language === "ar" ? "scaleX(-1)" : "scaleX(1)",
          }}
        />

        {/* Mobile Background Image */}
        <motion.img
          src={mobileBg}
          alt="Background Mobile"
          initial={{ scale: 1.1, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 22, ease: "easeOut" }}
          className="absolute inset-0 sm:hidden w-full h-[100vh] object-cover object-left"
        />

        {/* Mobile Gradient Overlay */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(1, 44, 70, 0.6)  0%, rgba(93, 133, 149, 0.1) 100%, rgba(47, 43, 37, 1) 30%)",
          }}
        />

        {/* Desktop Gradient Overlay */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(rgba(1, 44, 70, 0.5) 20%, rgba(93, 133, 149, 0.3) 100%, rgb(47, 43, 37, 0) 30%)",
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
            className="object-contain  w-32 md:w-44"
          />

          {/* Download + Ajdan Logo */}
          <div
            className={`flex items-center gap-2 md:gap-6 ${
              i18n.language === "ar" ? "justify-start" : "justify-end"
            }`}
          >
            {/* Brochure download buttons */}
            {data?.pdf_upload?.length > 0 &&
              data.pdf_upload.map((fileUrl, idx) => (
                <a
                  key={idx}
                  href={`${STRAPI_URL}${fileUrl}`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    style={{
                      lineHeight: "1",
                      paddingTop: 0,
                      paddingBottom: 0,
                      fontFamily: "AzerFont",
                      fontWeight: 400,
                      height: 28,
                    }}
                    className="relative px-3 sm:px-4 text-[9px] sm:text-[12px]
                      text-white shadow
                     border-[1.5px] border-[#8A421F] rounded-sm bg-transparent"
                  >
                    {i18n.language === "ar"
                      ? `تنزيل الكتيب${
                          data.pdf_upload.length > 1 ? ` ${idx + 1}` : ""
                        }`
                      : `Download Brochure${
                          data.pdf_upload.length > 1 ? ` ${idx + 1}` : ""
                        }`}
                  </button>
                </a>
              ))}

            {/* Ajdan Logo */}
            <div className="h-7 w-7 flex items-center justify-center rounded-sm bg-gradient-to-r from-[#8A421F] to-[#8A421F] md:bg-none">
              <a
                href="https://ajdan.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={ajdan}
                  alt="Logo"
                  className="object-contain w-auto h-4 sm:h-6"
                />
              </a>
            </div>
          </div>
        </motion.header>

        <main className="w-full sm:w-[100%] md:w-[100%] lg:w-[100%] max-w-6xl mx-auto px-4 min-h-screen flex flex-col justify-center md:grid md:grid-cols-2 items-center text-white relative margintop">
          {/* Left Content */}
          <div className="text-center md:pr-6 md:px-4 lg:px-12 md:text-left">
            <motion.h1
              initial="hiddenTop"
              animate="showTop"
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              variants={textVariants}
              className="leading-none text-white font-azer font-regular"
            >
              <span
                className="bayfront-heading uppercase block md:text-start text-center text-[30px] md:text-[24px] lg:text-[32px] xl:text-[36px]"
                style={{
                  fontFamily: "AzerFont",
                  fontWeight: 400,
                  textBoxTrim: "trim-both",
                }}
              >
                {data?.project_headline}
              </span>

              <span
                className="bayfront-subheading md:text-start text-center block pt-4 whitespace-nowrap text-[24px] md:text-[20px] lg:text-[28px] xl:text-[30px] sm:mt-1 mb-4 md:mb-0 mt-10px-sm"
                style={{
                  fontFamily: "AzerFont",
                  fontWeight: 400,
                  textBoxTrim: "trim-both",
                }}
              >
                {data?.project_description}
              </span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className={`hidden my-6 border-t md:block border-white/80 ${
                i18n.language === "ar" ? "origin-right" : "origin-left" // Right for Arabic, left for English
              }`}
            />
          </div>

          {/* Right Form Card */}
          <motion.div
            initial={{ x: i18n.language === "ar" ? -150 : 150, opacity: 0 }} // Left for Arabic, right for English
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: i18n.language === "ar" ? -80 : 80, opacity: 0 }} // Left for Arabic, right for English
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            className="w-full max-w-xl xs:w-[95%] sm:p-8 md:p-4 lg:p-12 mx-6 sm:mx-8 md:mx-auto bg-no-repeat sm:mt-0"
          >
            <h2
              className={`mb-4 text-[10px] xs:text-[10px] sm:text-[12px] md:text-sm  text-[#FFFFFF] uppercase register ${
                i18n.language === "ar" ? "text-start" : "text-start" // Right align for Arabic, left for English
              }`}
              style={{
                fontFamily: "AzerFont",
                fontWeight: 400,
                fontSize: "12px",
              }}
            >
              {t("register_interest")}
            </h2>

            <form
              className="flex flex-col gap-2 font-aeoniknormal font-regular"
              onSubmit={handleSubmit}
              noValidate
            >
              <input
                type="hidden"
                name="title"
                value={formData.title ?? ""}
                readOnly
              />

              {/* Full Name */}
              <div>
                <input
                  type="text"
                  name="username"
                  style={{
                    fontFamily: "AzerFont",
                    fontWeight: 400,
                    fontSize: "12px",
                  }}
                  value={formData.username ?? ""}
                  onChange={handleChange}
                  placeholder={t("full_name")}
                  className={`w-full h-10 text-[10px] text-white bg-[#012C46] rounded-sm border ${
                    errors.username ? "border-red-500" : "border-[#5D8595]"
                  } focus:border-[#ffffff] focus:outline-none placeholder:text-[10px] placeholder-[#5D8595] uppercase px-4`}
                  aria-invalid={!!errors.username}
                  aria-describedby="err-username"
                  required
                />
                {errors.username && (
                  <p
                    id="err-username"
                    className="mt-1 text-[10px] leading-tight text-red-400"
                  >
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <input
                  type="email"
                  name="email"
                  style={{
                    fontFamily: "AzerFont",
                    fontWeight: 400,
                    fontSize: "12px",
                  }}
                  value={formData.email ?? ""}
                  onChange={handleChange}
                  placeholder={t("email_address")}
                  className={`w-full h-10 text-[10px] text-white bg-[#012C46] rounded-sm border ${
                    errors.email ? "border-red-500" : "border-[#5D8595]"
                  } focus:border-[#ffffff] focus:outline-none placeholder:text-[10px] placeholder:text-[#5D8595] px-4`}
                  aria-invalid={!!errors.email}
                  aria-describedby="err-email"
                  required
                />
                {errors.email && (
                  <p
                    id="err-email"
                    className="mt-1 text-[10px] leading-tight text-red-400"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <div className="flex w-full gap-2 phone-stack">
                  <select
                    value={dialCode ?? "+966"}
                    onChange={(e) => setDialCode(e.target.value)}
                    className={`w-20 h-10 text-[11px] text-[#5D8595] font-aeoniknormal custom-select2 rounded-sm bg-[#012C46] border ${
                      errors.phone ? "border-red-500" : "border-[#5D8595]"
                    } focus:border-[#ffffff] focus:outline-none appearance-none px-3 font-normal ${
                      !dialCode ? "text-[#5D8595]" : "text-white"
                    }`}
                  >
                    <option value="+966">+966</option>
                    <option value="+971">+971</option>
                  </select>

                  <input
                    type="tel"
                    name="phone"
                    style={{
                      fontFamily: "AzerFont",
                      fontWeight: 400,
                      fontSize: "12px",
                    }}
                    value={formData.phone ?? ""}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, "");
                      setFormData((prev) => ({ ...prev, phone: numericValue }));
                      setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    placeholder={t("mobile_number")}
                    className={`flex-1 h-10 text-[10px] text-white bg-[#012C46] rounded-sm border ${
                      errors.phone ? "border-red-500" : "border-[#5D8595]"
                    } focus:border-[#ffffff] focus:outline-none px-4 placeholder:text-[10px] placeholder:text-start placeholder:text-[#5D8595]
          `}
                    aria-invalid={!!errors.phone}
                    aria-describedby="err-phone"
                    required
                  />
                </div>
                {errors.phone && (
                  <p
                    id="err-phone"
                    className="mt-1 text-[10px] leading-tight text-red-400"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Reason */}
              <div>
                <div className="relative w-full">
                  <select
                    name="more_details_code"
                    value={moreDetailsCode}
                    style={{
                      fontFamily: "AzerFont",
                      fontWeight: 400,
                      fontSize: "10px",
                    }}
                    onChange={(e) => {
                      setMoreDetailsCode(e.target.value);
                      setErrors((prev) => ({ ...prev, moreDetailsCode: "" }));
                    }}
                    className={`w-full h-10 text-[9px] sm:text-[9px] bg-[#012C46] rounded-sm border custom-select2 ${
                      errors.moreDetailsCode
                        ? "border-red-500"
                        : "border-[#5D8595]"
                    } focus:border-[#ffffff] focus:outline-none appearance-none px-3 py-2 sm:px-4 sm:py-3 pl-4 pr-2 min-h-[35px] sm:min-h-auto ${
                      moreDetailsCode === "" ? "text-[#D7E0E2]" : "text-white"
                    }`}
                    aria-invalid={!!errors.moreDetailsCode}
                    aria-describedby="err-reason"
                    required
                  >
                    <option
                      value=""
                      disabled
                      className="text-[9px] text-[#E6D9C4]"
                    >
                      {t("more_details")}
                    </option>
                    {MORE_DETAIL_OPTIONS.map((opt) => (
                      <option
                        key={opt.code}
                        value={opt.code}
                        className="text-[9px] text-white"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 text-[10px] text-[#E6D9C4] pointer-events-none ${
                      i18n.language === "ar" ? "left-3" : "right-3" // Left for Arabic, right for English
                    }`}
                  >
                    ▼
                  </span>
                </div>

                {errors.moreDetailsCode && (
                  <p
                    id="err-reason"
                    className="mt-1 text-[10px] leading-tight text-red-400"
                  >
                    {errors.moreDetailsCode}
                  </p>
                )}
              </div>

              {/* Message */}
              {/* <textarea
                name="message"
                value={formData.message ?? ""}
                onChange={handleChange}
                rows="4"
                placeholder={t("write_message")}
                className="w-full text-[10px] text-white bg-[#124A63] rounded-sm border border-[#AFD4E0] focus:border-[#ffffff] focus:outline-none px-4 py-3 resize-none placeholder:text-[10px] placeholder-[#D7E0E2]"
              /> */}

              {/* Submit */}
              <div className="p-[1px] rounded-sm bg-gradient-to-r from-[#8A421F] to-[#C28560] hover:bg-gradient-to-l transition-all duration-700 ease-in-out bg-clip-padding box-border">
                <button
                  type="submit"
                  style={{ fontFamily: "AzerFont", fontWeight: 400 }}
                  disabled={submitting}
                  className={`w-full font-regular text-white rounded-sm bg-gradient-to-r from-[#8A421F] to-[#C28560] hover:from-[#C28560] hover:to-[#8A421F] text-[10px] md:text-[12px] transition-all duration-700 ease-in-out items-center justify-center uppercase
    ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {submitting ? t("submitting") ?? "Submitting…" : t("submit")}
                </button>
              </div>
            </form>
            <SuccessPopup
              open={showSuccess}
              onClose={() => setShowSuccess(false)}
              // Use i18n keys if you have them; otherwise these fallbacks match your mock
              body={
                t("form_success") ||
                (i18n.language === "ar"
                  ? "سنقوم بالرد عليك قريبًا."
                  : "We shall revert back to you shortly.")
              }
              okLabel={t("ok") || (i18n.language === "ar" ? "حسناً" : "OK")}
            />

            {/* Buttons Row (under form) */}
            <div className="flex items-center justify-between w-full mt-4 sm:mt-6">
  {/* WhatsApp Icon */}
  {socialLinks?.whatsapp && (
    <a
      href={socialLinks.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="transition hover:scale-110 ml-[1px]"
    >
      <img
        src={wa}
        alt="WhatsApp"
        className="object-contain w-8 sm:w-12 sm:h-12 drop-shadow-lg"
      />
    </a>
  )}
</div>
          </motion.div>

          {/* Mobile-only subheading spacer */}
          <div className="block md:hidden text-start w-[94%] ml-0" />
        </main>

        <div
          className={`fixed z-50 flex flex-col items-center gap-3 ${
            i18n.language === "ar" ? "left-0 sm:left-6" : "right-0 sm:right-6"
          } bottom-2 sm:bottom-6`}
        >
          <LangToggle />

          <a
            href="https://wa.me/XXXXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 transition hover:scale-110"
          >
            <img
              src={wa}
              alt="WhatsApp"
              className="object-contain w-10 h-10 sm:w-12 sm:h-12 drop-shadow-lg"
            />
          </a>
        </div>
      </motion.div>

      {/* Slider */}
      <div className="relative w-full overflow-hidden h-72 md:h-screen">
        {!isMobile &&
          slides.map((slide, index) => (
            <motion.div
              key={`${index}-${slide}`}
              className={`absolute inset-0 transition-all duration-200 ${
                index === current ? "z-10" : "z-0 pointer-events-none"
              }`}
              initial={{ opacity: 0, scale: 1 }}
              animate={{
                opacity: index === current && scrollY > 50 ? 1 : 0,
                scale: index === current ? 1.05 : 1,
              }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{
                opacity: { duration: 3, ease: "easeOut", delay: 0.2 },
                scale: { duration: 6, ease: "linear" },
              }}
              drag={false}
            >
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </motion.div>
          ))}

        {isMobile &&
          slides.map((slide, index) => (
            <motion.div
              key={`${index}-${slide}`}
              className={`absolute inset-0 transition-all duration-200 ${
                index === current ? "z-10" : "z-0 pointer-events-none"
              }`}
              initial={{ opacity: 0, scale: 1 }}
              animate={{
                opacity: index === current && scrollY > 50 ? 1 : 0,
                scale: index === current ? 1.05 : 1,
              }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{
                opacity: { duration: 3, ease: "easeOut", delay: 0.2 },
                scale: { duration: 6, ease: "linear" },
              }}
              drag={index === current ? "x" : false}
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
        <div className="py-8 bg-[#F2F2F2]">
          <div className="flex items-center justify-between w-full px-6 md:px-12">
            {/* Social Icons */}
            <div className="flex justify-start gap-5 xs:gap-3">
              {socialLinks.instagram && (
                <motion.a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="flex items-center justify-center w-6 h-6 bg-[#8A421F] text-white text-base rounded-sm hover:bg-[#8A421F] transition"
                >
                  <FaInstagram />
                </motion.a>
              )}

              {socialLinks.twitter && (
                <motion.a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="flex items-center justify-center w-6 h-6 bg-[#8A421F] text-white text-base rounded-sm hover:bg-[#8A421F] transition"
                >
                  <FaXTwitter />
                </motion.a>
              )}

              {socialLinks.tiktok && (
                <motion.a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="flex items-center justify-center w-6 h-6 bg-[#8A421F] text-white text-base rounded-sm hover:bg-[#8A421F] transition"
                >
                  <FaTiktok />
                </motion.a>
              )}

              {socialLinks.linkedin && (
                <motion.a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="flex items-center justify-center w-6 h-6 bg-[#8A421F] text-white text-base rounded-sm hover:bg-[#8A421F] transition"
                >
                  <FaLinkedin />
                </motion.a>
              )}
            </div>

            {/* Logos */}
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

        <div className="bg-[#012C46] py-4">
          <div className="max-w-[1340px] mx-auto px-6 flex items-center justify-center">
            {i18n.language === "ar" ? (
              <p className="text-[9px] text-center text-white font-aeoniknormal md:text-[10px]">
                © حقوق النشر{" "}
                <a
                  href="https://ajdan.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  أجدان
                </a>{" "}
                <span className="font-apollo">|</span> جميع الحقوق محفوظة.
              </p>
            ) : (
              <p
                className="text-[9px] text-center text-white  md:text-[10px]"
                style={{ fontFamily: "AzerFont", fontWeight: 400 }}
              >
                © COPYRIGHT{" "}
                <a
                  href="https://ajdan.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  AJDAN
                </a>{" "}
                <span className="font-apollo">|</span> ALL RIGHTS RESERVED.
              </p>
            )}
          </div>
        </div>
      </footer>
    </>
  );
};

export default DarahAlwajhah;




