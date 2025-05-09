import React, { useState, useEffect } from 'react';
import slider1 from '../../assets/image/slider1.jpeg';
import slider2 from '../../assets/image/slider2.jpeg';
import imageone from '../../assets/image/one.jpg';
import imagetwo from '../../assets/image/two.jpg';
import imagethree from '../../assets/image/three.jpg';

const Sample = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [slider1, slider2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };



  
  const images1 = [
    {
      url: "https://cdn.builder.io/api/v1/image/assets/TEMP/5e10f2fcea8a09b71fc3bfa37eb38169872882c0",
      alt: "Image 1",
      title: "ALL CONNECTED BY HOME",
      desc: "Discover how five families found their dream homes with [Your Real Estate Brand], each one a unique journey filled with emotion and new beginnings.",
    },
    {
      url: "https://cdn.builder.io/api/v1/image/assets/TEMP/b0e186fcf804031df8939dad32eabaed011e5822",
      alt: "Image 2",
      title: "INNOVATING COMMUNITIES",
      desc: "Building vibrant spaces for modern families, rooted in tradition and elevated by design.",
    },
    {
      url: "https://cdn.builder.io/api/v1/image/assets/TEMP/4eafbf578181b8c1ed9c056b9a31709bf3fb41f4",
      alt: "Image 3",
      title: "LIVE YOUR FUTURE",
      desc: "Our developments are designed to align with Vision 2030, fostering growth and lifestyle.",
    },
    {
      url: "https://cdn.builder.io/api/v1/image/assets/TEMP/5e10f2fcea8a09b71fc3bfa37eb38169872882c0",
      alt: "Image 4",
      title: "LIVE YOUR FUTURE",
      desc: "Our developments are designed to align with Vision 2030, fostering growth and lifestyle.",
    },
    {
      url: "https://cdn.builder.io/api/v1/image/assets/TEMP/b0e186fcf804031df8939dad32eabaed011e5822",
      alt: "Image 5",
      title: "LIVE YOUR FUTURE",
      desc: "Our developments are designed to align with Vision 2030, fostering growth and lifestyle.",
    },
  ];

  const [startIndex, setStartIndex] = useState(0);

  const handlePrevious = () => {
    setStartIndex((prevIndex) =>
      (prevIndex - 1 + images1.length) % images1.length
    );
  };

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % images1.length);
  };

  const getVisibleImages = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (startIndex + i) % images1.length;
      visible.push(images1[index]);
    }
    return visible;
  };

  const panels = [
    { image: imageone, content: "Ajdan is actively involved in projects that align with the Vision 2030 goals, particularly in real estate development. They are building sustainable, inclusive, and thriving communities.." },
    { image: imagetwo, content: "Ajdan is actively involved in projects that align with the Vision 2030 goals, particularly in real estate development. They are building sustainable, inclusive, and thriving communities.." },
    { image: imagethree, content: "Ajdan is actively involved in projects that align with the Vision 2030 goals, particularly in real estate development. They are building sustainable, inclusive, and thriving communities.." },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const projects = [
    {
      title: "Project 01",
      category: "RESIDENTIAL",
      location: "Land Mark",
      date: "01-01-2025",
      description:
        "Is actively involved in projects that align with the Vision 2030 goals, particularly in real estate development.",
      images: [
        "https://cdn.builder.io/api/v1/image/assets/TEMP/538c8c411e9a3ed5172ab354466af0b3f9e3889a?placeholderIfAbsent=true",
        "https://cdn.builder.io/api/v1/image/assets/TEMP/3324a8cfd459c3a7dea82ec97e1f67e663413bcb?placeholderIfAbsent=true",
      ],
    },
    {
      title: "Project 02",
      category: "COMMERCIAL",
      location: "City Center",
      date: "15-02-2025",
      description:
        "This commercial project is designed to support growing businesses with modern infrastructure.",
      images: [
        "https://media.istockphoto.com/id/1409298953/photo/real-estate-agents-shake-hands-after-the-signing-of-the-contract-agreement-is-complete.jpg?s=612x612&w=0&k=20&c=SFybbpGMB0wIoI0tJotFqptzAYK_mICVITNdQIXqnyc=",
        "https://t4.ftcdn.net/jpg/03/00/10/35/360_F_300103505_oBLUa4dEG8mFdP60givbyNdoy7aHFmuu.jpg",
      ],
    },
    // Add more projects as needed
  ];
  const [index, setIndex] = useState(0);
  const project = projects[index];
  const prevProject = () => {
    setIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const nextProject = () => {
    setIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };
  return (
    <>
      {/* Section1 */}
      <div className="relative w-full mb-8 mr-8 overflow-hidden">
        {/* Slides container */}
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, index) => (
            <div key={index} className="flex-shrink-0 w-screen h-screen">
              <img
                src={img}
                className="object-cover w-full h-full"
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute flex space-x-3 transform -translate-x-1/2 bottom-5 left-1/2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentIndex === index ? "bg-blue-500" : "bg-gray-400"
                }`}
            ></button>
          ))}
        </div>
      </div>

      <section className="flex flex-row justify-between items-start p-0 mx-auto my-0 w-full bg-white max-w-[1384px] max-md:flex-col max-md:items-center max-md:max-w-[991px] max-sm:p-2.5 max-sm:max-w-screen-sm">
      {/* Project Details Section */}
      <aside className="flex flex-col items-start p-2.5 w-[300px] max-md:items-center max-sm:items-center">
        <header className="flex flex-col items-start mb-5">
          <span className="mb-2.5 text-base uppercase text-slate-700">
            {project.category}
          </span>
          <h1 className="text-4xl text-slate-700 max-sm:text-3xl">
            {project.title}
          </h1>
        </header>

        <section className="flex flex-col items-start mb-5">
          <div className="mb-2.5">
            <span className="text-base uppercase text-slate-700">
              LOCATION
            </span>
            <h2 className="text-2xl text-slate-700 max-sm:text-xl">
              {project.location}
            </h2>
          </div>
          <div className="mb-2.5">
            <span className="text-base uppercase text-slate-700">
              RELEASE DATE
            </span>
            <h2 className="text-2xl text-slate-700 max-sm:text-xl">
              {project.date}
            </h2>
          </div>
        </section>

        <p className="mb-5 text-base text-slate-700 w-[204px] max-sm:w-full max-sm:text-sm">
          {project.description}
        </p>

        {/* Navigation Buttons */}
        <nav className="flex flex-row gap-2.5 items-center">
          <button
            onClick={prevProject}
            className="flex justify-center items-center px-4 py-1 rounded-3xl border border-solid border-slate-700 h-[33px] w-[69px] max-sm:h-[30px] max-sm:w-[50px]"
            aria-label="Previous"
          >
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 6.5L9 12.5L15 18.5"
                stroke="#293C47"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={nextProject}
            className="flex justify-center items-center px-4 py-1 rounded-3xl border border-solid border-slate-700 h-[33px] w-[69px] max-sm:h-[30px] max-sm:w-[50px]"
            aria-label="Next"
          >
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6.5L15 12.5L9 18.5"
                stroke="#293C47"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </nav>
      </aside>

      {/* Project Images */}
      <figure className="flex flex-row items-center gap-5 max-md:flex-col max-md:items-center">
      {project.images.map((img, idx) => (
  <img
    key={idx}
    src={img}
    className={`h-[660px] ${
      idx === 0 ? "w-[660px]" : "w-[400px]"
    } max-md:w-full max-md:h-auto max-sm:w-full max-sm:h-auto`}
    alt={`Project ${index + 1} Image ${idx + 1}`}
  />
))}

      </figure>
    </section>

      {/* Section3 */}
      <div className="relative w-full py-8">
        <h1 className="text-4xl text-center semi-bold"> Vision 2030</h1>
        <div className="flex items-center justify-center gap-4">
          {/* Left Arrow */}
          <button
            onClick={handlePrevious}
            className="p-3 transition bg-white rounded-full shadow-md hover:bg-gray-200"
          >
            <span className="text-2xl font-bold text-gray-700">&#8592;</span>
          </button>

          {/* Image container */}
          <div className="flex justify-center w-full max-w-screen-xl gap-4 px-4">
            {getVisibleImages().map((img, idx) => (
              <div
                key={idx}
                className="relative w-1/3 overflow-hidden rounded-lg shadow-md group"
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 m-4 text-center transition-opacity duration-300 bg-white opacity-0 group-hover:opacity-100">
                  <h2 className="mb-2 text-xl font-bold text-black">
                    {img.title}
                  </h2>
                  <p className="text-sm text-black">{img.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="p-3 transition bg-white rounded-full shadow-md hover:bg-gray-200"
          >
            <span className="text-2xl font-bold text-gray-700">&#8594;</span>
          </button>
        </div>
      </div>

      {/* Section4 */}
      <div className="relative w-full py-8">
  <div className="flex w-full mx-auto space-x-2 h-max-w-6xl h-50%">
    {panels.map((panel, index) => (
      <div
        key={index}
        onMouseEnter={() => setActiveIndex(index)}
        className={`h-[500px] transition-all duration-[1000ms] ease-in-out cursor-pointer rounded-lg overflow-hidden bg-white shadow-md ${activeIndex === index || (activeIndex === 0 && index === 0) ? "flex-[3]" : "flex-[1]"}`}
      >
        <div className="relative h-full">
          <img
            src={panel.image}
            alt={`Panel ${index + 1}`}
            className={`w-full object-cover rounded-lg h-full transition-transform duration-300 ${activeIndex === index || (activeIndex === 0 && index === 0) ? "scale-100" : "scale-110"}`}
          />
          
          {/* Conditional rendering of bottom overlay */}
          {(activeIndex === index || (activeIndex === 0 && index === 0)) && (
            <div className="absolute bottom-0 left-0 w-full p-4 text-sm bg-white">
              <p className="text-gray-600">{panel.content}</p>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

    </>
  );
};

export default Sample;