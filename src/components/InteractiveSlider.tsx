import React, { useRef, useState, useEffect } from 'react';

interface InteractiveSliderProps {
  images: string[];
  title: string;
  imageWidth?: number;
  imageHeight?: number;
  gap?: number;
  borderRadius?: number;
}

export const InteractiveSlider: React.FC<InteractiveSliderProps> = ({
  images,
  title,
  imageWidth = 200,
  imageHeight = 300,
  gap = 16,
  borderRadius = 16,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll positions to show/hide navigation buttons
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      // Use 1px buffer to account for rounding errors
      setCanScrollLeft(scrollLeft > 1);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Run once initially and on window resize
      checkScroll();
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [images]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = imageWidth + gap;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <style>{`
        .slider-section-container {
          position: relative;
          width: 100%;
        }
        
        .slider-viewport {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Firefox */
          padding: 10px 0;
        }
        
        .slider-viewport::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
        
        .slider-track {
          display: flex;
          will-change: transform;
          margin: 0 auto;
        }
        
        .slider-card {
          flex: 0 0 auto;
          scroll-snap-align: start;
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), filter 0.4s ease;
          filter: grayscale(20%);
          cursor: pointer;
          position: relative;
        }
        
        .slider-card:hover {
          transform: translateY(-8px) scale(1.02);
          filter: grayscale(0%) brightness(1.05);
        }
        
        .slider-img {
          display: block;
          object-fit: cover;
          width: 100%;
          height: 100%;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transition: box-shadow 0.4s ease;
        }
        
        .slider-card:hover .slider-img {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }
        
        /* Glassmorphic Nav Buttons */
        .slider-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 50%;
          background: rgba(15, 15, 15, 0.7);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          opacity: 0;
          pointer-events: none;
        }
        
        .slider-section-container:hover .slider-nav-btn {
          opacity: 1;
          pointer-events: auto;
        }
        
        /* Always show controls on mobile devices */
        @media (max-width: 1024px) {
          .slider-nav-btn {
            opacity: 1;
            pointer-events: auto;
            width: 2.8rem;
            height: 2.8rem;
          }
        }
        
        .slider-nav-btn:hover {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
          transform: translateY(-50%) scale(1.08);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
        }
        
        .slider-nav-btn:disabled {
          opacity: 0 !important;
          pointer-events: none !important;
        }
        
        .slider-nav-btn.btn-left {
          left: -1.75rem;
        }
        
        .slider-nav-btn.btn-right {
          right: -1.75rem;
        }
        
        @media (max-width: 768px) {
          .slider-nav-btn.btn-left {
            left: 0.5rem;
          }
          
          .slider-nav-btn.btn-right {
            right: 0.5rem;
          }
        }
      `}</style>

      <div className="slider-section-container">
        {/* Left Nav Button */}
        <button
          className="slider-nav-btn btn-left"
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Scrollable Viewport */}
        <div
          ref={scrollContainerRef}
          className="slider-viewport"
        >
          <div
            className="slider-track"
            style={{ gap: `${gap}px` }}
          >
            {images.map((src, i) => (
              <div
                key={src + '-' + i}
                className="slider-card"
                style={{
                  width: `${imageWidth}px`,
                  height: `${imageHeight}px`,
                  borderRadius: `${borderRadius}px`,
                }}
              >
                <img
                  src={src}
                  alt={`${title} poster ${i + 1}`}
                  className="slider-img"
                  loading="lazy"
                  style={{ borderRadius: `${borderRadius}px` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Nav Button */}
        <button
          className="slider-nav-btn btn-right"
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </>
  );
};
