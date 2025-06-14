import React, { useEffect, useState } from 'react';
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
import {
  FaVectorSquare,
  FaStore,
  FaTree,
  FaHome,
  FaBuilding,
  FaCar,
  FaUsers,
} from 'react-icons/fa';

const AjdanBayfront = () => {
    const [data, setData] = useState(null);
    const [showForm, setShowForm] = useState(false);
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

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await getListingByIdentifier('bayfront', i18n.language);
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        loadData();
    }, [i18n.language]);

    const isArabic = i18n.language === 'ar';

    if (!data) return <p>{t('loading')}...</p>;

    // Helper function to get localized field
    const getLocalized = (field) => {
        return (isArabic && data[`${field}_ar`]) ? data[`${field}_ar`] : data[field];
    };

    return (
        <>
            <BayfrontHeader />
            {/* section-1 */}
            {/* Hero Section */}
            <section
                className="relative w-full h-screen md:h-[90vh] bg-cover bg-center opacity-90"
                style={{ backgroundImage: `url(${herosectionimg})` }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>

                {/* Enquire Now - Vertical Button - Hidden on mobile */}
                {/* <div className="hidden md:block fixed left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-top-left bg-white px-3 py-2 text-sm font-semibold shadow z-50 cursor-pointer">
                    ENQUIRE NOW
                </div> */}

                {/* Center Button */}
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
                    <button className="px-4 py-2 md:px-6 md:py-3 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition text-sm md:text-base">
                        Schedule a Tour
                    </button>
                </div>

                {/* Floating Buttons - Hidden on mobile */}
                {/* <div className="hidden md:flex absolute right-5 bottom-5 flex-col gap-3 z-20">
                    <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-500 text-white text-lg md:text-xl shadow-lg flex items-center justify-center">
                        🕒
                    </button>
                    <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500 text-white text-lg md:text-xl shadow-lg flex items-center justify-center">
                        📱
                    </button>
                </div> */}

                {/* Bottom Navigation */}
                <nav className="absolute bottom-0 w-full z-20 flex justify-center gap-4 md:gap-16 p-3 md:p-5 bg-gradient-to-t from-black/80 to-transparent text-white font-bold text-xs md:text-base">
                    <a href="#about" className="hover:underline">{t('about')}</a>
                    <a href="#statistics" className="hover:underline">{t('statistics')}</a>
                    <a href="#amenities" className="hover:underline">{t('amenities')}</a>
                    <a href="#investment" className="hover:underline">{t('investment')}</a>
                </nav>
            </section>


            {/* section-2 */}
            {/* About Section */}
            <section
                className="max-h-screen flex items-center justify-center px-4 md:px-6 py-20 md:py-44 bg-cover bg-center text-white"
                style={{ backgroundImage: `url(${bayfront1})` }}
                id="about"
            >
                <div className="max-w-6xl w-full">
                    {/* Headline */}
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-headline text-right mb-6 md:mb-10 leading-snug">
                        {t('bayfront.headline1')}<br />
                        {t('bayfront.headline2')}<br />
                        {t('bayfront.headline3')}
                    </h1>

                    {/* Description & Button */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 md:gap-8">
                        <div className="flex-1">
                            <p className="font-headline mb-2">{t('bayfront.subtitle')}</p>
                            <p className="text-xs md:text-sm lg:text-base opacity-90 leading-relaxed font-body">
                                {t('bayfront.description1')}<br />
                                {t('bayfront.description2')}<br />
                                {t('bayfront.description3')}<br />
                                {t('bayfront.description4')}
                            </p>
                        </div>

                        <div className="flex items-center justify-center lg:justify-end mt-4 md:mt-0">
                            {/* <button className="px-4 py-1 md:px-6 md:py-2 border border-white hover:bg-white hover:text-black transition-all text-sm md:text-base">
                                {t('download_brochure')}
                            </button> */}
                        </div>
                    </div>
                </div>
            </section>

            {/* section-3 */}
            {/* Statistics Section */}
            <div
                className="relative h-auto md:h-screen bg-cover bg-center flex items-center px-4 md:pl-16 py-20 md:py-0 text-white"
                style={{
                    backgroundImage: `url(${bayfront2})`, 
                }}
                id="statistics"
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 z-0" />

                {/* Info Panel */}
                <div className="relative z-10 flex flex-col gap-4 md:gap-6 max-w-xs w-full mx-auto md:mx-0">
                    {stats.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 md:gap-4">
                            <div>{item.icon}</div>
                            <div>
                                <p className="text-xs md:text-sm mb-1">{t(`stats.${item.label.toLowerCase().replace(' ', '_')}`)}</p>
                                <h2 className="text-base md:text-lg font-semibold">
                                    {item.value}{" "}
                                    {item.unit && <span className="text-xs md:text-sm font-normal">{item.unit}</span>}
                                </h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* section-4 */}
            {/* Amenities Section */}
            <section className="relative bg-[#fdf8f4] py-8 md:py-12 px-4 md:px-6 lg:px-16" id="amenities">
                {/* Header and Button */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-[#8B5E3C] mb-4 md:mb-0">
                        {t('amenities')}
                    </h2>
                    <button 
                        className="border border-black px-4 py-1 md:px-5 md:py-2 hover:bg-black hover:text-white transition text-sm md:text-base"
                        onClick={() => setShowForm(true)}
                    >
                        {t('enquire_now')}
                    </button>
                </div>

                {/* Amenities Grid */}
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
                            <h3 className="font-semibold mt-2 text-sm md:text-base">{t(`amenities.${index}.title`)}</h3>
                            <p className="text-xs md:text-sm text-gray-600">{t(`amenities.${index}.subtitle`)}</p>
                        </div>
                    ))}
                </div>
            </section>


{/* section-5 */}
 <div className="relative w-full h-screen bg-cover bg-center"style={{ backgroundImage: `url(${bayfront8})` }}
>

  {/* Pin Elements */}
  <div className="absolute top-[15%] left-[40%] group">
  {/* Animated Circle */}
  <div className="relative flex flex-col items-center">
    {/* Vertical Line Above */}
    <div className="w-0.5 h-6 bg-white opacity-0 transition-all duration-300 group-hover:opacity-50 group-hover:-translate-y-2"></div>

    {/* Expanding Circle */}
    <div className="w-4 h-4 bg-white rounded-full border-4 border-white shadow-lg transition-all duration-300 group-hover:w-10 group-hover:h-10 group-hover:opacity-30"></div>

    {/* Text Appears */}
    <div className="text-white text-sm mt-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
      Exclusive Beach Club
    </div>
  </div>
</div>


  {/* Title */}
  <div className="absolute bottom-10 left-10 text-white text-4xl font-serif">Waves of Luxury</div>

  {/* Floating Buttons */}
  <div className="fixed bottom-6 right-6 space-y-2 flex flex-col items-center">
    <button className="bg-green-500 w-12 h-12 mt-12 rounded-full flex items-center justify-center shadow-lg">📞</button>
    {/* <button className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">💬</button> */}
  </div>
</div>

{/* section-6 */}
<div className="bg-[#f7f0e9] min-h-screen">
      {/* Top Bar */}
      <div className="bg-white flex justify-between items-center px-10 py-6 border-b border-[#e8dcd0]">
        <h1 className="text-2xl md:text-3xl font-serif text-[#b3703b]">
          Financing and Installment Plans
        </h1>
        <button className="border border-black px-5 py-2 text-sm hover:bg-[#f0e6dd] transition">
          Know More
        </button>
      </div>

      {/* Combined Content */}
      <div className="flex flex-col md:flex-row items-center justify-center px-4 py-10 gap-0 md:gap-4">
        {/* Combined Card */}
        <div className="bg-white h-auto flex flex-col md:flex-row w-full max-w-7xl rounded shadow-md overflow-hidden">
          {/* Left Image */}
          <div className="md:w-1/2 w-full">
            <img
              src={bayfront9}
              alt="Investment"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="md:w-1/2 w-full p-8">
            <h2 className="text-2xl font-serif text-[#b3703b] border-b border-[#e2c6a8] pb-4 mb-6">
              Investment Opportunity
            </h2>

            {[
              ['Fine Dining', '8 Units', '500 Sqm'],
              ['Casual Dining', '12 Units', '300 Sqm'],
              ['Fast Food', '20 Units', '200 Sqm'],
              ['Buffet Style', '15 Units', '100 Sqm'],
              ['Food Truck', '5 Units', '150 Sqm']
            ].map(([type, units, sqm], idx) => (
              <div key={idx} className="flex justify-between text-[17px] mb-4">
                <span className="font-semibold text-[#b3703b]">{type}</span>
                <span className="text-gray-700">{units}</span>
                <span className="text-gray-700">{sqm}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>


{/* section-7 */}
 <div className="relative mt-0 bg-white font-serif">
      {/* Title */}
      <h2 className="text-center text-[#b3703b] text-2xl md:text-3xl px-4 font-semibold mt-8 mb-4">
        Take a glimpse around Bayfront
      </h2>

      {/* Main Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-auto h-auto object-cover mx-auto"
      >
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* ENQUIRE NOW - Vertical Button */}
      <div className="fixed top-1/2 left-4 transform -translate-y-1/2 -rotate-90 origin-left z-40">
        <button className="bg-white border border-gray-300 text-xs font-medium px-4 py-2 shadow-md hover:bg-gray-100 transition">
          ENQUIRE NOW
        </button>
      </div>

      {/* Floating Icons - Bottom Right */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        {/* Call Icon */}
        <button className="w-10 h-10 rounded-full bg-[#a55c29] flex items-center justify-center shadow-md hover:opacity-80">
          <img
            src="https://cdn-icons-png.flaticon.com/512/724/724664.png"
            alt="Call"
            className="w-5 h-5"
          />
        </button>

        {/* WhatsApp Icon */}
        <button className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shadow-md hover:opacity-80">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1384/1384023.png"
            alt="WhatsApp"
            className="w-5 h-5"
          />
        </button>
      </div>
    </div>

            {/* Footer */}
            <BayfrontFooter />
            
            {/* Contact Form */}
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