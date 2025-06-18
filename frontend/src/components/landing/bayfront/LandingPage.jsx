import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import BayfrontHeader from './Header';
import BayfrontFooter from './Footer';
import { getListingByIdentifier } from '../../../services/getListingByIdentifier';
import ContactForm from '../PopupContactForm';
import herosectionimg from '../../../assets/landing images/bayfronthero.jpg';
import bayfront1 from '../../../assets/landing images/bayfrontbg1.png';
import bayfront2 from '../../../assets/landing images/bayfront2.jpg';
import bayfront3 from '../../../assets/landing images/bayfrontAminity1.jpg';
import bayfront4 from '../../../assets/landing images/beach.jpeg';
import bayfront5 from '../../../assets/landing images/dining.jpg';
import bayfront6 from '../../../assets/landing images/retail.webp';
import bayfront7 from '../../../assets/landing images/water.jpg';
import bayfront8 from '../../../assets/landing images/bayfrontimg.png';
import bayfront9 from '../../../assets/landing images/bayfront3.jpg';
import video from '../../../assets/landing images/Sandbox.mp4';
import coursol2 from '../../../assets/landing images/bayfrontcoursal2.jpg';
import coursol3 from '../../../assets/landing images/bayfrontcoursol3.jpg';
import map from '../../../assets/landing images/map.png';
import {
  FaVectorSquare,
  FaStore,
  FaTree,
  FaHome,
  FaBuilding,
  FaCar,
  FaUsers,
} from 'react-icons/fa';

const DraggableMapWithMarkers = ({ imageSrc, markers }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Initialize position to show top-left of image
  useEffect(() => {
    if (containerRef.current) {
      // Start with image aligned to top-left (position 0,0)
      setPosition({ x: 0, y: 0 });
    }
  }, []);

  const startDragging = (e) => {
    if (e.touches && e.touches.length > 1) return;
    
    setDragging(true);
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    
    setStartPos({
      x: clientX - position.x,
      y: clientY - position.y,
    });
    
    document.body.style.userSelect = 'none';
  };

  const stopDragging = () => {
    setDragging(false);
    document.body.style.userSelect = '';
  };

  const onDragging = (e) => {
    if (!dragging) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (!clientX || !clientY) return;
    
    // Calculate new position
    let newX = clientX - startPos.x;
    let newY = clientY - startPos.y;
    
    // Constrain movement to keep image within container
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    const imgWidth = 1920; // Fixed image width
    const imgHeight = 1080; // Fixed image height
    
    // Calculate maximum allowed position (right/bottom edges)
    const maxX = Math.min(0, containerWidth - imgWidth);
    const maxY = Math.min(0, containerHeight - imgHeight);
    
    // Apply constraints
    newX = Math.max(maxX, Math.min(0, newX));
    newY = Math.max(maxY, Math.min(0, newY));
    
    setPosition({ x: newX, y: newY });
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[70vh] overflow-hidden touch-none bg-gray-100"
      onMouseLeave={stopDragging}
    >
      <div
        ref={imageRef}
        className="absolute bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${imageSrc})`,
          width: '1920px',
          height: '1080px',
          cursor: dragging ? 'grabbing' : 'grab',
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: dragging ? 'none' : 'transform 0.2s ease',
        }}
        onMouseDown={startDragging}
        onMouseUp={stopDragging}
        onMouseMove={onDragging}
        onTouchStart={startDragging}
        onTouchEnd={stopDragging}
        onTouchMove={onDragging}
      >
        {markers.map(({ id, label, top, left, direction }) => (
          <div
            key={id}
            className="absolute group"
            style={{
              top: top,
              left: left,
            }}
          >
            <div className="relative flex flex-col items-center">
              {direction === "up" && (
                <div className="flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 mb-2 sm:mb-3">
                  <div className="text-white text-xs sm:text-sm whitespace-nowrap bg-black/50 px-2 py-1 rounded">
                    {label}
                  </div>
                  <div className="w-px h-8 sm:h-12 bg-white" />
                </div>
              )}

              <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                <div className="absolute w-full h-full rounded-full bg-white opacity-20 animate-rippleOuter pointer-events-none" />
                <div className="absolute w-10 h-10 rounded-full bg-white opacity-40 animate-rippleMiddle pointer-events-none" />
                <div className="w-4 h-4 rounded-full bg-white border-2 border-white z-10" />
              </div>

              {direction === "down" && (
                <div className="flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 mt-2 sm:mt-3">
                  <div className="w-px h-8 sm:h-12 bg-white" />
                  <div className="text-white text-xs sm:text-sm mt-1 whitespace-nowrap bg-black/50 px-2 py-1 rounded">
                    {label}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-10 md:left-10 text-white text-xl sm:text-2xl md:text-4xl font-chapaza z-10 pointer-events-none">
        Waves of Luxury
      </div>
    </div>
  );
};

const AjdanBayfront = () => {
    const [data, setData] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const { t, i18n } = useTranslation();

    const stats = [
        { icon: <FaVectorSquare className="text-white text-xl" />, label: 'Total Land Area', value: '100,000+', unit: 'sqm' },
        { icon: <FaStore className="text-white text-xl" />, label: 'Retail Space', value: '19000+', unit: 'sqm' },
        { icon: <FaTree className="text-white text-xl" />, label: 'Outdoor Area', value: '94000+', unit: 'sqm' },
        { icon: <FaHome className="text-white text-xl" />, label: 'Indoor Area', value: '11000+', unit: 'sqm' },
        { icon: <FaBuilding className="text-white text-xl" />, label: 'Available Units', value: '24' },
        { icon: <FaCar className="text-white text-xl" />, label: 'Parking Spaces', value: '495' },
        { icon: <FaUsers className="text-white text-xl" />, label: 'Event Capacity', value: '2500' },
    ];

    

    const amenities = [
        {
            title: 'Cafe',
            subtitle: 'Brew Moments by the Sea',
            image: bayfront3,
        },
        {
            title: 'Sunrise at heart of Alkhobar',
            subtitle: 'Wake to Khobars Glow',
            image: bayfront4,
        },
        {
            title: 'Private Dining',
            subtitle: 'Exclusive Dining Bliss',
            image: bayfront5,
        },
        {
            title: 'Retail Area',
            subtitle: 'Shop by the Waves',
            image: bayfront6,
        },
        {
            title: 'Water Activities',
            subtitle: 'Aqua Thrills Await',
            image: bayfront7,
        },
    ];

    const carouselSlides = [
        {
            image: herosectionimg,
            label: 'Private Dining',
        },
        {
            image: coursol2,
            label: 'Retail Space',
        },
        {
            image: coursol3,
            label: 'Dining Area',
        },
    ];

    const markers = [
      {
        id: 1,
        label: "Exclusive Beach Club",
        top: "2%",
        left: "13%",
        direction: "down"
      },
      {
        id: 2,
        label: "Fine Dining zone",
        top: "32%",
        left: "70%",
        direction: "up"
      },
      {
        id: 3,
        label: "Events & Pop-up zone",
        top: "47%",
        left: "71%",
        direction: "up"
      },
      {
        id: 4,
        label: "Kids zone",
        top: "76%",
        left: "57%",
        direction: "up"
      },
      {
        id: 5,
        label: "Casual zone",
        top: "54%",
        left: "46%",
        direction: "up"
      },
    ];

const investmentData = [
  ["Fine Dining", "8 Units", "500 Sqm"],
  ["Casual Dining", "12 Units", "300 Sqm"],
  ["Fast Food", "20 Units", "200 Sqm"],
  ["Buffet Style", "15 Units", "100 Sqm"],
  ["Food Truck", "5 Units", "150 Sqm"],
  ["Cafe", "10 Units", "250 Sqm"],
];

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await getListingByIdentifier('bayfront', i18n.language);
                setData(result);
                console.log(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        loadData();
    }, [i18n.language]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    };

    const isArabic = i18n.language === 'ar';

    if (!data) return <p>{t('loading')}...</p>;

    const getLocalized = (field) => {
        return (isArabic && data[`${field}_ar`]) ? data[`${field}_ar`] : data[field];
    };

    return (
        <>
            <BayfrontHeader />            
            
            {/* Hero Section */}
            <section
              className="relative w-full h-screen bg-cover bg-center opacity-90"
              style={{ backgroundImage: `url(${herosectionimg})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>

              <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20">
                <button className="group relative inline-block">
                  <span className="absolute inset-0 bg-transparent group-hover:bg-white transition-colors duration-300 z-0 rounded"></span>
                  <span className="relative z-10 inline-block border-2 border-white group-hover:border-black text-white group-hover:text-black px-6 py-2 font-chapaza text-sm md:text-base transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                    Schedule a Tour
                  </span>
                </button>
              </div>

              <nav className="absolute bottom-0 w-full z-20 grid grid-cols-4 gap-4 bg-gradient-to-t from-black/80 to-transparent text-white font-chapaza text-xs md:text-base text-center px-2">
                {[
                  { href: "#about", label: t('about') },
                  { href: "#statistics", label: t('statistics') },
                  { href: "#amenities", label: t('amenities') },
                  { href: "#investment", label: t('investment') },
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="group relative py-4 border-t-2 border-gray-600 overflow-hidden"
                  >
                    <span className="relative inline-block">
                      {item.label}
                      <span
                        className="absolute left-[calc(100%+32px)] top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out group-hover:translate-x-[100%] group-hover:opacity-0"
                      >
                        →
                      </span>
                    </span>
                  </a>
                ))}
              </nav>
            </section>

            {/* About Section */}
    <section
  className="min-h-[75vh] flex items-center justify-center px-4 md:px-6 py-16 md:py-32 bg-cover bg-center text-white"
  style={{ backgroundImage: `url(${bayfront1})` }}
  id="about"
>
  <div className="max-w-6xl mx-auto w-full flex flex-col items-center text-center md:text-left">
    {/* Heading */}
    <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-chapaza mb-6 md:mb-10 leading-snug">
      <div className="text-right md:text-right">Where elegant design</div>
      <div className="text-center md:text-justify">meets a calm shore to create luxury</div>
      <div className="text-left md:text-left">lifestyle by Khobar's sea.</div>
    </h1>

    {/* Content Row */}
    <div className="flex flex-col lg:flex-row justify-between gap-6 sm:gap-8 w-full">
      {/* Left Text */}
      <div className="lg:w-1/3 text-center lg:text-left">
        <p className="font-chapaza  text-white text-base sm:text-lg md:text-xl mb-2">
          Coastal Lifestyle Perfected
        </p>
      </div>

      {/* Right Text + Button */}
      <div className="lg:w-2/3 w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          {/* Paragraph */}
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 leading-relaxed font-commuter text-center lg:text-left lg:w-3/4">
            A famous seafront destination offering luxury residences,
            vibrant retail, fine dining, and world-class leisure experiences.
            Bayfront transforms Khobar's coastline into a lifestyle
            landmark aligned with Saudi Vision 2030's forward-thinking vision.
          </p>

          {/* Brochure Button */}
          <div className="lg:w-1/4 w-full flex justify-center lg:justify-end mt-4 lg:mt-0">
            <a href="/brochure.pdf" className="group relative inline-block whitespace-nowrap">
              <span className="absolute inset-0 bg-transparent group-hover:bg-white transition-colors duration-300 z-0 rounded"></span>
              <span className="relative z-10 inline-block border border-white group-hover:border-black text-white group-hover:text-black px-5 py-2 text-xs sm:text-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                Download Brochure
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>



            {/* Statistics Section */}
            <div
                className="relative h-auto md:h-screen bg-cover bg-center flex items-center px-4 md:pl-16 py-20 md:py-0 text-white"
                style={{ backgroundImage: `url(${bayfront2})` }}
                id="statistics"
            >
                <div className="absolute inset-0 bg-black/40 z-0" />
                <div className="relative z-10 flex flex-col gap-4 md:gap-6 max-w-xs w-full mx-auto md:mx-0">
                    {stats.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 md:gap-4">
                            <div>{item.icon}</div>
                            <div>
                                <p className="text-xs md:text-sm mb-1">{t(`stats.${item.label.toLowerCase().replace(' ', '_')}`)}</p>
                                <h2 className="text-base md:text-lg font-commuter">
                                    {item.value}{" "}
                                    {item.unit && <span className="text-xs md:text-sm font-commuter">{item.unit}</span>}
                                </h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Amenities Section */}
         <section className="relative bg-[#fdf8f4] py-8 md:py-12 px-4 md:px-6 lg:px-16" id="amenities">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-chapaza text-[#8B5E3C] mb-4 md:mb-0">
            Amenities
        </h2>
        <div className="relative inline-block">
            <button
                onClick={() => setShowForm(true)}
                className="group relative inline-block"
            >
                <span className="absolute inset-0 bg-white group-hover:bg-black transition-colors duration-300 rounded z-0"></span>
                <span className="relative z-10 inline-block border-2 border-black group-hover:border-white text-black group-hover:text-white px-6 py-2 font-chapaza text-sm md:text-base transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                    Enquire Now
                </span>
            </button>
        </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-12">
        {amenities.map((item, index) => (
            <div key={index} className="text-left">
                <div className="overflow-hidden rounded">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover transform transition-transform duration-1000 ease-in-out hover:scale-110"
                    />
                </div>
                <h3 className="font-commuter mt-2 text-sm md:text-base">
                    {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                    {item.subtitle}
                </p>
            </div>
        ))}
    </div>
</section>

            {/* Waves of Luxury Section - Replaced with DraggableMapWithMarkers */}
            <DraggableMapWithMarkers imageSrc={bayfront8} markers={markers} />

            {/* Financing Section */}
            <div className="bg-[#f7f0e9] min-h-[75vh]">
              <div className="bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 md:px-10 py-4 sm:py-6 border-b border-[#e8dcd0]">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-chapaza text-[#b3703b] mb-3 sm:mb-0">
                  Financing and Installment Plans
                </h1>
                <button className="group relative inline-block text-xs sm:text-sm self-end sm:self-auto">
                  <span className="absolute inset-0 bg-transparent group-hover:bg-black transition-colors duration-300 rounded z-0" />
                  <span className="relative z-10 inline-block border border-black group-hover:border-white text-black group-hover:text-white px-3 py-1 sm:px-4 sm:py-1.5 md:px-5 md:py-2 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                    Know More
                  </span>
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center px-2 sm:px-4 py-6 sm:py-10 gap-4 h-full min-h-[calc(75vh-80px)]">
      <div className="bg-white flex flex-col md:flex-row w-full max-w-7xl rounded shadow-md overflow-hidden">
        
        {/* Left: Image */}
        <div className="md:w-1/2 w-full h-48 sm:h-64 md:h-full">
          <img
            src={bayfront9}
            alt="Investment"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Content */}
        <div className="md:w-1/2 w-full p-4 sm:p-6 md:p-8 overflow-y-auto">
          <h2 className="text-xl sm:text-2xl font-chapaza text-[#b3703b] pb-3 sm:pb-4 mb-4 sm:mb-6">
            Investment Opportunity
          </h2>

          <div className="grid gap-3 sm:gap-4 md:gap-5">
            {investmentData.map(([type, units, sqm], idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm sm:text-base md:text-lg"
              >
                <span className="font-commuter text-[#b3703b] w-1/3">{type}</span>
                <span className="text-gray-700  w-1/3 text-center">{units}</span>
                <span className="text-gray-700  w-1/3 text-center">{units}</span>
                <span className="text-gray-700 w-1/3 text-right">{sqm}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
            </div>

            {/* Video Section */}
            <div className="relative mx-4 sm:mx-12 md:mx-24 my-10 bg-white font-commuter">
              <h2 className="text-center text-[#b3703b] text-xl sm:text-2xl md:text-3xl px-4 font-chapaza mt-6 sm:mt-8 mb-4">
                Take a glimpse around Bayfront
              </h2>

              <div className="w-full max-w-6xl mx-auto">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto object-cover rounded-md"
                >
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="fixed top-1/2 left-2 sm:left-4 transform -translate-y-1/2 -rotate-90 origin-left z-40">
                <button 
                   onClick={() => setShowForm(true)} 
                className="bg-white border border-gray-300 text-[10px] sm:text-xs font-chapaza px-3 sm:px-4 py-1.5 sm:py-2 shadow-md hover:bg-gray-100 transition">
                  ENQUIRE NOW
                </button>
              </div>

              <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex flex-col gap-2 sm:gap-3 z-40">
                <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#a55c29] flex items-center justify-center shadow-md hover:opacity-80">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/724/724664.png"
                    alt="Call"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </button>
                <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#25D366] flex items-center justify-center shadow-md hover:opacity-80">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1384/1384023.png"
                    alt="WhatsApp"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </button>
              </div>
            </div>

            {/* Carousel Section */}
        <div className="relative w-full h-screen overflow-hidden">
  {carouselSlides.map((slide, index) => (
    <div
      key={index}
      className={`absolute inset-0 transition-opacity duration-700 ${
        index === currentSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
      }`}
    >
      <img
        src={slide.image}
        alt={`Slide ${index}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-6 sm:bottom-10 left-4 sm:left-10 text-white text-lg sm:text-2xl md:text-3xl font-chapaza break-words max-w-xs sm:max-w-md md:max-w-lg">
        {slide.label}
      </div>
    </div>
  ))}

  {/* Navigation Buttons */}
  <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex items-center gap-3 z-20">
    <button
      onClick={prevSlide}
      className="bg-white p-2 sm:p-3 rounded-full shadow hover:bg-gray-100 transition"
    >
      <span className="text-base sm:text-xl">&#8592;</span>
    </button>
    <button
      onClick={nextSlide}
      className="bg-white p-2 sm:p-3 rounded-full shadow hover:bg-gray-100 transition"
    >
      <span className="text-base sm:text-xl">&#8594;</span>
    </button>
  </div>
</div>


            <div className="flex flex-col md:flex-row items-center justify-center bg-[#f8f1eb] p-6 md:p-12">
             <div className="relative w-full md:w-[600px]">
  {/* Map Image */}
  <img
    src={map}
    alt="Map showing Bayfront location"
    className="rounded-md w-full h-auto"
  />

  {/* Blinking Highlight */}
  <div className="absolute top-[49%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-10">
    <div className="relative">
      {/* Outer blinking circle */}
      <div className="w-6 h-6 bg-red-600 rounded-full opacity-70 animate-blink"></div>

      {/* Static center dot */}
      <div className="w-3 h-3 bg-gray-300 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"></div>
    </div>
  </div>
</div>


              <div className="mt-8 md:mt-0 md:pl-16 max-w-md text-center md:text-left">
                <h2 className="text-4xl text-[#a35726] font-chapaza leading-tight">
                  Locate<br />Bayfront
                </h2>
                <p className="mt-6 text-[#00323d] text-base leading-relaxed">
                  <span className="inline-block mr-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
</svg>
</span>
                  Prince Turkey Street, Alkurnais, Al Khobar 34446,<br />
                  Saudi Arabia
                </p>
              </div>
            </div>
            
            <BayfrontFooter />
            <ContactForm 
                show={showForm} 
                onClose={() => setShowForm(false)} 
                listingTitle={getLocalized('title')}
                isArabic={isArabic}
            />
        </>
    );
};

export default AjdanBayfront;