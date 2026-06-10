import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

interface LoaderOverlayProps {
  forceShow?: boolean;
}

const LoaderOverlay: React.FC<LoaderOverlayProps> = ({ forceShow }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const logoImgRef = useRef<HTMLImageElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // 1. Client-side mount and session guard check
  useEffect(() => {
    setIsMounted(true);

    const urlParams = new URLSearchParams(window.location.search);
    const forceShowParam = urlParams.get('forceShow') === 'true';

    const isReload = (() => {
      try {
        const navs = performance.getEntriesByType('navigation');
        if (navs.length > 0) {
          return (navs[0] as PerformanceNavigationTiming).type === 'reload';
        }
        return performance.navigation.type === 1; // Fallback: TYPE_RELOAD
      } catch (e) {
        return false;
      }
    })();

    const hasPlayed = sessionStorage.getItem('quantum_loader_played') === 'true';
    if (hasPlayed && !forceShow && !forceShowParam && !isReload) {
      setShouldPlay(false);
    } else {
      setShouldPlay(true);
    }
  }, [forceShow]);

  // 2. GSAP animation timeline execution (only when shouldPlay is true and component is rendered)
  useEffect(() => {
    if (!shouldPlay) return;

    // Save original overflow styles
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    // Block scrolling while loader is active
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Set up GSAP timeline with a startup delay to let the browser settle down
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.4,
        onComplete: () => {
          sessionStorage.setItem('quantum_loader_played', 'true');
          document.body.style.overflow = 'unset';
          document.documentElement.style.overflow = 'unset';
        },
      });

      timelineRef.current = tl;

      // 1. Set initial states (using hardware accelerated scaleX for progress bar)
      gsap.set(textOverlayRef.current, { width: '0%', force3D: true });
      gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: 'left', force3D: true });
      gsap.set(logoImgRef.current, { opacity: 0, force3D: true });

      // 2. Progress wipe (duration: 1.2s, ease: power2.inOut)
      tl.to(textOverlayRef.current, {
        width: '100%',
        duration: 1.2,
        ease: 'power2.inOut',
        force3D: true,
      });
      tl.to(progressBarRef.current, {
        scaleX: 1,
        duration: 1.2,
        ease: 'power2.inOut',
        force3D: true,
      }, '<'); // simultaneously

      // 3. Fade out Slide 1 (duration: 0.3s, starts 0.1s after wipe)
      tl.to([textContainerRef.current, progressBarRef.current], {
        opacity: 0,
        duration: 0.3,
        ease: 'power1.inOut',
        force3D: true,
      }, '+=0.1');

      // 4. Fade in Slide 2 logo (duration: 1.0s, overlaps Slide 1 fade out by 0.2s for cross-fade)
      tl.to(logoImgRef.current, {
        opacity: 1,
        duration: 1.0,
        ease: 'power1.inOut',
        force3D: true,
      }, '-=0.2');

      // 5. Curtain exit (duration: 0.8s, starts 0.6s after logo fade completes)
      tl.to(overlayRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
        force3D: true,
      }, '+=0.6');
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ctx.revert();
      document.body.style.overflow = originalBodyOverflow || 'unset';
      document.documentElement.style.overflow = originalHtmlOverflow || 'unset';
    };
  }, [shouldPlay]);

  if (!isMounted || !shouldPlay) {
    return null;
  }

  return (
    <>
      <style>{`
        .loader-logo-text {
          font-family: var(--font-adieu);
          font-weight: 400;
          font-size: 4rem;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          user-select: none;
        }
        .loader-logo-image {
          width: 7rem;
          height: 7rem;
          object-fit: contain;
        }
        @media (max-width: 768px) {
          .loader-logo-text {
            font-size: 2.5rem;
          }
        }
        @media (min-width: 768px) {
          .loader-logo-image {
            width: 10rem;
            height: 10rem;
          }
        }
      `}</style>

      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: '#000000',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
        }}
      >
        {/* Slide 1 - Logo/Brand Text */}
        <div
          ref={textContainerRef}
          style={{
            position: 'absolute',
            display: 'inline-block',
            willChange: 'opacity',
          }}
        >
          {/* Base Layer ("unlit") */}
          <div
            className="loader-logo-text"
            style={{
              color: '#333333',
            }}
          >
            Ouantum
          </div>
          {/* Overlay Layer ("lit") */}
          <div
            ref={textOverlayRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '0%',
              height: '100%',
              overflow: 'hidden',
              willChange: 'width',
            }}
          >
            <div
              className="loader-logo-text"
              style={{
                color: '#ffffff',
                whiteSpace: 'nowrap',
                width: 'max-content',
              }}
            >
              Ouantum
            </div>
          </div>
        </div>

        {/* Slide 2 - Logo Image */}
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            ref={logoImgRef}
            src="/assets/images/logo.png"
            alt="Quantum Logo"
            className="loader-logo-image"
            style={{
              filter: 'invert(1)',
              opacity: 0,
              willChange: 'opacity',
            }}
          />
        </div>

        {/* Full-width bottom progress bar */}
        <div
          ref={progressBarRef}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '4px',
            backgroundColor: '#ffffff',
            width: '100%',
            transform: 'scaleX(0)',
            willChange: 'transform',
          }}
        />
      </div>
    </>
  );
};

export default LoaderOverlay;
