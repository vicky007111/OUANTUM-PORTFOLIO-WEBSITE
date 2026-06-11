import { useEffect, useRef } from 'react';

export interface MarqueeImage {
  src: string;
  alt: string;
}

interface CanvasMarqueeProps {
  images: MarqueeImage[];
  imageWidth?: number;
  imageHeight?: number;
  gap?: number;
  speed?: number; // pixels per second
  borderRadius?: number;
}

export function CanvasMarquee({
  images,
  imageWidth = 200,
  imageHeight = 300,
  gap = 16,
  speed = 60,
  borderRadius = 16,
}: CanvasMarqueeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas height
    const DPR = window.devicePixelRatio || 1;
    canvas.style.height = `${imageHeight}px`;
    canvas.height = imageHeight * DPR;

    // Resize handler
    const resize = () => {
      canvas.style.width = '100%';
      canvas.width = canvas.offsetWidth * DPR;
      ctx.scale(DPR, DPR);
    };
    resize();

    // Strip width = (imageWidth + gap) * imageCount
    const stripWidth = (imageWidth + gap) * images.length;

    // Preload and cache all images into offscreen canvases
    const offscreens: (OffscreenCanvas | null)[] = new Array(images.length).fill(null);
    let loadedCount = 0;

    images.forEach((imgData, i) => {
      const img = new Image();
      img.src = imgData.src;

      const draw = () => {
        const oc = new OffscreenCanvas(imageWidth * DPR, imageHeight * DPR);
        const octx = oc.getContext('2d')!;
        octx.scale(DPR, DPR);

        // Rounded clip
        octx.beginPath();
        octx.roundRect(0, 0, imageWidth, imageHeight, borderRadius);
        octx.clip();

        // Emulate filter: grayscale(20%) which was in CSS
        octx.filter = 'grayscale(20%)';

        // Draw image covering the rect
        // object-fit: cover logic for 2:3 aspect ratio
        const imgAspect = img.width / img.height;
        const canvasAspect = imageWidth / imageHeight;

        let drawWidth = imageWidth;
        let drawHeight = imageHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (imgAspect > canvasAspect) {
          // Image is wider than canvas
          drawWidth = imageHeight * imgAspect;
          offsetX = (imageWidth - drawWidth) / 2;
        } else {
          // Image is taller than canvas
          drawHeight = imageWidth / imgAspect;
          offsetY = (imageHeight - drawHeight) / 2; // object-position: top center would be offsetY = 0, but let's just do top center
          offsetY = 0; // top center
        }

        octx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        offscreens[i] = oc;
        loadedCount++;
      };

      if (img.complete) {
        draw();
      } else {
        img.onload = draw;
        img.onerror = () => { loadedCount++; }; // skip broken images gracefully
      }
    });

    // Placeholder color while image loads
    const placeholderColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-background-secondary').trim() || '#0a0a0a'; // #0a0a0a was the background of the item

    let offset = 0;
    let lastTime: number | null = null;

    const frame = (timestamp: number) => {
      if (lastTime === null) lastTime = timestamp;
      const delta = (timestamp - lastTime) / 1000; // seconds
      lastTime = timestamp;

      const canvasLogicalWidth = canvas.offsetWidth;
      offset += speed * delta;
      if (offset >= stripWidth) offset -= stripWidth; // seamless loop

      ctx.clearRect(0, 0, canvasLogicalWidth, imageHeight);

      // Draw two copies of the strip for seamless looping
      for (let copy = 0; copy < 3; copy++) {
        const copyX = copy * stripWidth - offset;
        if (copyX > canvasLogicalWidth) break; // no need to draw off-screen
        // If the end of this copy is before 0, we could skip it, but let's just iterate

        images.forEach((_, i) => {
          const x = copyX + i * (imageWidth + gap);
          if (x + imageWidth < 0 || x > canvasLogicalWidth) return; // cull

          if (offscreens[i]) {
            ctx.drawImage(offscreens[i]!, x, 0, imageWidth, imageHeight);
          } else {
            // Placeholder rect while loading
            ctx.fillStyle = placeholderColor;
            ctx.beginPath();
            ctx.roundRect(x, 0, imageWidth, imageHeight, borderRadius);
            ctx.fill();
          }
        });
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pause on reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotion = (e: MediaQueryListEvent) => {
      if (e.matches) {
        cancelAnimationFrame(rafRef.current);
      } else {
        lastTime = null;
        rafRef.current = requestAnimationFrame(frame);
      }
    };
    mq.addEventListener('change', handleMotion);
    if (mq.matches) cancelAnimationFrame(rafRef.current);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      mq.removeEventListener('change', handleMotion);
    };
  }, [images, imageWidth, imageHeight, gap, speed, borderRadius]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Team members scrolling gallery"
      role="img"
      style={{ display: 'block', width: '100%' }}
    />
  );
}
