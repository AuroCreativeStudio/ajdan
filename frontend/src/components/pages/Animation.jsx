import React, { useEffect, useRef } from 'react';

const ParallaxScroll = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      const sections = containerRef.current.querySelectorAll('.parallax-section');

      sections.forEach((section, index) => {
        const speed = 0.5 + index * 0.1; // different speed for each banner
        section.style.transform = `translateY(${scrollTop * speed}px)`;
      });
    };

    const onScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const images = [
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  ];

  return (
    <div ref={containerRef}>
      {images.map((img, index) => (
        <div
          key={index}
          className="parallax-section"
          style={{
            height: '100vh',
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform',
            transition: 'transform 0.1s ease-out',
          }}
        />
      ))}
    </div>
  );
};

export default ParallaxScroll;
